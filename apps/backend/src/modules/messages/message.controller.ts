import { Request, Response } from "express";
import { getUserMessages, saveMessage } from "./message.service";

export async function getMessagesController(req: Request, res: Response): Promise<void> {
  try {
    // Check if user is authenticated
    if (!req.user?.id) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    // Retrieve messages for the authenticated user
    const messages = await getUserMessages(String(req.user.id));
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function postMessageController(req: Request, res: Response): Promise<void> {
  try {
    // Check if user is authenticated
    if (!req.user?.id) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    const { content, recipientId, conversationId } = req.body;

    // Validate required fields
    if (!recipientId || !conversationId) {
      res.status(400).json({ error: "recipientId and conversationId are required." });
      return;
    }

    // Save the new message
    const message = await saveMessage({
      content,
      senderId: String(req.user.id),
      recipientId,
      conversationId,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Error saving message." });
  }
}
