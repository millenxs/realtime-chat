import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const setupWebSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

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

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user);

    socket.on('message', async (data) => {
      // Salvar no banco com Prisma
      // Emitir para a sala correta
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};
