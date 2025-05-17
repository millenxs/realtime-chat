import { prisma } from "../../config/database"; // conexão com o Prisma
import { User } from "@prisma/client"; // <- importa tipo gerado automaticamente

export const getAllUsersFromDB = async (): Promise<User[]> => {
  const users = await prisma.user.findMany(); // busca todos os usuários
  return users;
};