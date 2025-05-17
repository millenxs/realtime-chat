import { prisma } from '../../config/database'; 

export async function getUserConversations(userId: string) {
  // Busca todas as conversas onde o usuário está participando
  return await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      participants: {
        select: {
          userId: true,
          user: {
            select: {
              name: true,
              email: true,
              // outros campos do usuário que quiser expor
            },
          },
        },
      },
      lastMessage: true, // se você tiver campo lastMessage para mostrar um resumo
    },
    orderBy: {
      updatedAt: 'desc', // ordem das conversas pela última atualização
    },
  });
}

export async function createConversation(userId: string, recipientId: string) {
  // Verifica se já existe conversa entre os dois
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: { userId: userId },
          },
        },
        {
          participants: {
            some: { userId: recipientId },
          },
        },
      ],
    },
    include: {
      participants: true,
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  // Cria nova conversa com dois participantes
const newConversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { user: { connect: { id: userId } } },
          { user: { connect: { id: recipientId } } },
        ],
      },
    },
    include: {
      participants: true,
    },
  });

  return newConversation;
}
