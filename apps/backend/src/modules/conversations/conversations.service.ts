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
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      lastMessage: true
    },
    orderBy: {
      updatedAt: 'desc', 
    },
  });
}

export async function createConversation(userId: string, recipientId: string) {
  // Validações básicas
  if (!userId || !recipientId) {
    throw new Error('IDs de usuário inválidos');
  }

  if (userId === recipientId) {
    throw new Error('Não é possível criar uma conversa consigo mesmo');
  }

  // Verifica se ambos os usuários existem
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [userId, recipientId]
      }
    }
  });

  if (users.length !== 2) {
    throw new Error('Um ou ambos os usuários não existem');
  }

  // Verifica se já existe uma conversa entre esses usuários
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              userId: userId
            }
          }
        },
        {
          participants: {
            some: {
              userId: recipientId
            }
          }
        }
      ],
      // Garantir que a conversa tem EXATAMENTE esses dois participantes e nenhum outro
      participants: {
        every: {
          userId: {
            in: [userId, recipientId]
          }
        }
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      lastMessage: true
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  // Cria uma nova conversa entre os usuários
  try {
    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: userId },
            { userId: recipientId }
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        lastMessage: true
      }
    });

    return newConversation;
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    throw new Error('Não foi possível criar a conversa');
  }
}