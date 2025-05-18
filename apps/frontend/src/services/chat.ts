import { User, Conversation, Message, SavedMessage } from "@/types";
import api from "./api";

class ChatService {
  // Fetch all conversations for current user
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>("/conversations");
    return response.data;
  }

  // Fetch messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get<SavedMessage[]>(
      `/messages?conversationId=${conversationId}`
    );
    return response.data.map((msg, index, array) => this.formatMessage(msg));
  }

  // Send a new message
  async sendMessage(messageData: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    content: string;
  }): Promise<SavedMessage> {
    const response = await api.post<SavedMessage>("/messages", messageData);
    return response.data;
  }

  // Get all users for new conversation
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/user");
    return response.data;
  }

  // Get a specific user
  async getUser(userId: string): Promise<User> {
    const response = await api.get<User>(`/user/${userId}`);
    return response.data;
  }

  // Create a new conversation
  async createConversation(recipientId: string): Promise<Conversation> {
    const response = await api.post<Conversation>("/conversations", {
      recipientId,
    });
    return response.data;
  }

  // Format saved message to message format
  formatMessage(msg: SavedMessage, userId?: string): Message {
    return {
      id: msg.id,
      text: msg.content,
      content: msg.content,
      fromUser: userId ? msg.senderId === userId : false,
      senderId: msg.senderId,
      recipientId: msg.recipientId,
      conversationId: msg.conversationId
    };
  }
}

export const chatService = new ChatService();