import { prisma } from "../../config/database";

type User = Awaited<ReturnType<typeof prisma.user.findMany>>[0];

export const getAllUsersFromDB = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUserByIdFromDB = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};