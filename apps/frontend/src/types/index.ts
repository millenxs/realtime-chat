export interface Message {
  id: string;
  text: string;
  content?: string;
  fromUser: boolean;
  senderId: string;
  recipientId: string;
  conversationId?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Conversation {
  id: string;
  participants: { userId: string; user: User }[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    recipientId: string;
  };
}

export interface SavedMessage {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  conversationId: string;
}

export interface DecodedToken {
  id: string;
}