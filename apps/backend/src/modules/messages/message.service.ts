import { prisma } from "../../config/database";

interface SaveMessageParams {
  content: string;
  senderId: string;
  recipientId: string
  conversationId: string
}

export async function saveMessage({ content, senderId, recipientId, conversationId }: SaveMessageParams) {
  return await prisma.message.create({
    data: {
      content,
      senderId,
      recipientId,
      conversationId
    },
  });
}

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
        }
      ]
    },
    orderBy: {
      createdAt: 'asc',
    }
  });
}

