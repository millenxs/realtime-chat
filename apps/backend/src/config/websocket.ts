import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { saveMessage } from "../modules/messages/message.service";
import { prisma } from "../config/database";

// Map to store the relation userId <-> socket.id
const onlineUsers = new Map<string, string>();

export const setupWebSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // JWT authentication middleware on socket handshake
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

  // Function to find or create a conversation between two users
  const getOrCreateConversation = async (userId1: string, userId2: string) => {
    // First, fetch all conversations where userId1 is a participant
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

    // Filter to find conversation that has exactly these two users as participants
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

    // If no existing conversation found, create a new one with both participants
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

        // Get or create the conversation
        const conversation = await getOrCreateConversation(senderId, recipientId);

        // Save the message including conversationId
        const savedMessage = await saveMessage({
          content,
          senderId,
          recipientId,
          conversationId: conversation.id,
        });

        // Emit message to sender
        socket.emit('message', {
          id: savedMessage.id,
          text: savedMessage.content,
          fromUser: true,
          createdAt: savedMessage.createdAt,
          senderId,
          recipientId,
        });

        // Send message to recipient if online
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
        console.error("Error processing message:", error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', userId);
      onlineUsers.delete(userId);
    });
  });

  return io;
};
