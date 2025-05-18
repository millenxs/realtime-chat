import { Request, Response } from "express";
import { saveMessage, getUserMessages } from "./message.service";
import { prisma } from "../../config/database";

export async function getMessagesController(req: Request, res: Response): Promise<void> {
  try {
    // Check if the user is authenticated
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
    // Check if the user is authenticated
    if (!req.user?.id) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    const { content, conversationId } = req.body;
    const senderId = String(req.user.id);

    // Validate required fields: conversationId and content
    if (!conversationId || !content) {
      res.status(400).json({ error: "conversationId and content are required." });
      return;
    }

    // Fetch the participants of the conversation from the database
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    });

    // If the conversation doesn't exist, return 404 error
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found." });
      return;
    }

    // Identify the recipientId (participant different from the sender)
    const recipientId = conversation.participants.find(
      (p) => p.userId !== senderId
    )?.userId;

    // If recipientId not found, return error
    if (!recipientId) {
      res.status(400).json({ error: "Recipient could not be determined from the conversation." });
      return;
    }

    // Save the new message in the database
    const message = await saveMessage({
      content,
      senderId,
      recipientId,
      conversationId,
    });

    // Update the conversation's lastMessageId with the saved message ID
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageId: message.id },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Error saving message." });
  }
}
