import { Request, Response } from "express";
import { getAllUsersFromDB, getUserByIdFromDB } from "../users/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersFromDB();
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuários" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdFromDB(id);

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuário" });
  }
};