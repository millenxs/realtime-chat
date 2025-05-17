import { prisma } from "../../config/database";

interface SaveMessageParams {
  content: string;
  senderId: string;
  recipientId: string;
  conversationId: string;
}

// Save a new message in the database
export async function saveMessage({ content, senderId, recipientId, conversationId }: SaveMessageParams) {
  return await prisma.message.create({
    data: {
      content,
      senderId,
      recipientId,
      conversationId,
    },
  });
}

// Retrieve all messages sent by a specific user, ordered by creation time ascending
export async function getUserMessages(senderId: string) {
  return await prisma.message.findMany({
    where: {
      senderId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

// Retrieve all messages exchanged between two users, ordered by creation time ascending
export async function getConversation(userId: string, otherUserId: string) {
  return await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: userId,
          recipientId: otherUserId,
        },
        {
          senderId: otherUserId,
          recipientId: userId,
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
