import { Request, Response } from 'express';
import * as conversationService from '../conversations/conversations.service';

export async function getUserConversations(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Usuário não autenticado' });
    return;
  }

  const userId = String(req.user.id);
  const conversations = await conversationService.getUserConversations(userId);
  res.status(200).json(conversations);
}

export async function createConversation(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Usuário não autenticado' });
    return;
  }

  const userId = String(req.user.id);
  const { recipientId } = req.body;

  
  console.log('➡️ Body recebido:', req.body);
  console.log('➡️ ID do remetente:', userId);
  console.log('➡️ ID do destinatário:', recipientId);

  if (!recipientId) {
    res.status(400).json({ error: 'recipientId é obrigatório' });
    return;
  }

  const conversation = await conversationService.createConversation(userId, recipientId);
  res.status(201).json(conversation);
}
