import { prisma } from "../../config/database";

interface SaveMessageParams {
  content: string;
  senderId: string;
}

export async function saveMessage({ content, senderId }: SaveMessageParams) {
  return await prisma.message.create({
    data: {
      content,
      senderId,
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
