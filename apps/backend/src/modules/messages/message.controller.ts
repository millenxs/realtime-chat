import { Request, Response } from "express";
import { getUserMessages, saveMessage } from "./message.service";

export async function getMessagesController(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const messages = await getUserMessages(String(req.user.id));
    res.json(messages); // ✅ só envia, não retorna
  } catch (err) {
    console.error("Erro ao buscar mensagens:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function postMessageController(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const { content } = req.body;

    const message = await saveMessage({
      content,
      senderId: String(req.user.id),
    });

    res.status(201).json(message); // ✅ só envia, não retorna
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    res.status(500).json({ error: "Erro ao salvar mensagem." });
  }
}
