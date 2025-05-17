import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { saveMessage } from "../modules/messages/message.service";
import { prisma } from "../config/database";

// Map para guardar a relação userId <-> socket.id
const onlineUsers = new Map<string, string>();

export const setupWebSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
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

  // Função para buscar ou criar conversa entre dois usuários
  const getOrCreateConversation = async (userId1: string, userId2: string) => {
    // Primeiro busca todas as conversas que userId1 participa
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId1,
          },
        },
      },
      include: {
        participants: true,
      },
    });

    // Filtra para encontrar conversa que tenha exatamente os dois usuários como participantes
    for (const conversation of conversations) {
      const participantUserIds = conversation.participants.map((p: { userId: string }) => p.userId);
      if (
        participantUserIds.length === 2 &&
        participantUserIds.includes(userId1) &&
        participantUserIds.includes(userId2)
      ) {
        return conversation;
      }
    }

    // Se não encontrou conversa existente, cria uma nova com os dois participantes
    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: userId1 },
            { userId: userId2 },
          ],
        },
      },
      include: {
        participants: true,
      },
    });

    return newConversation;
  };

  io.on('connection', (socket) => {
    const userId = socket.data.user.id;
    console.log('User connected:', userId);

    onlineUsers.set(userId, socket.id);

    socket.on('message', async (data) => {
      try {
        const senderId = userId;
        const { text: content, recipientId } = data;

        if (!recipientId) {
          console.error('Recipient ID is required');
          return;
        }

        // Obtém ou cria a conversa
        const conversation = await getOrCreateConversation(senderId, recipientId);

        // Salva a mensagem, incluindo conversationId
        const savedMessage = await saveMessage({
          content,
          senderId,
          recipientId,
          conversationId: conversation.id,
        });

        // Emite para remetente
        socket.emit('message', {
          id: savedMessage.id,
          text: savedMessage.content,
          fromUser: true,
          createdAt: savedMessage.createdAt,
          senderId,
          recipientId,
        });

        // Envia para destinatário, se online
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message', {
            id: savedMessage.id,
            text: savedMessage.content,
            fromUser: false,
            createdAt: savedMessage.createdAt,
            senderId,
            recipientId,
          });
        }
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', userId);
      onlineUsers.delete(userId);
    });
  });

  return io;
};
