import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { saveMessage } from "../modules/messages/message.service";
import { generateGeminiResponse } from "./gemini";

export const setupWebSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  // Middleware de autenticação JWT no handshake do socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.user = payload;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Evento de conexão do socket
  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user);

    // Evento de recebimento de mensagem
    socket.on('message', async (data) => {
      try {
        const senderId = socket.data.user.id;
        const content = data.text;

        // 1. Salva a mensagem do usuário no banco de dados
        const savedMessage = await saveMessage({ content, senderId });

        // 2. Emite a mensagem do usuário para todos os sockets conectados
        io.emit('message', {
          id: savedMessage.id,
          text: savedMessage.content,
          fromUser: true,
          createdAt: savedMessage.createdAt,
          senderId: senderId,
        });

        // 3. Gera resposta da IA (Gemini)
        const aiResponse = await generateGeminiResponse(content);

        // 4. Emite a resposta da IA
        io.emit('message', {
          id: Date.now().toString(), // ou gere um UUID se preferir
          text: aiResponse,
          fromUser: false,
          createdAt: new Date(),
          senderId: "BOT_GEMINI",
        });

        // (Opcional) Salvar a resposta da IA no banco, se necessário
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
      }
    });

    // Evento de desconexão
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};
