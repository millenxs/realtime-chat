"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { User, Conversation, Message, DecodedToken } from "@/types";
import { chatService } from "@/services/chat";
import { socketService } from "@/services/socket";

interface ChatContextType {
  userId: string;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  setSelectedConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string) => Promise<void>;
  createNewConversation: (recipientId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user ID and socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id);

      // Connect to socket
      socketService.connect(token)
        .then(() => {
          console.log("Socket conectado com sucesso");
        })
        .catch((error) => {
          console.error("Falha ao conectar socket:", error);
        });

      // Set up message handler
      socketService.onMessage((msg) => {
        const newMessage = {
          id: msg.id,
          text: msg.content || msg.text || "",
          fromUser: msg.senderId === decoded.id,
          senderId: msg.senderId,
          recipientId: msg.recipientId,
          conversationId: msg.conversationId
        };
        
        // Update messages if the message belongs to the selected conversation
        if (selectedConversation && msg.conversationId === selectedConversation.id) {
          setMessages((msgs) => [...msgs, newMessage]);
        }
        
        // Update last message in conversations list
        if (msg.conversationId) {
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.id === msg.conversationId 
                ? { 
                    ...conv, 
                    lastMessage: {
                      id: msg.id,
                      content: msg.content || msg.text || "",
                      senderId: msg.senderId,
                      recipientId: msg.recipientId
                    } 
                  } 
                : conv
            )
          );
        }
      });

      // Load conversations
      fetchConversations();

      return () => {
        socketService.disconnect();
      };
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
    }
  }, []);

  // Fetch messages when selected conversation changes
  useEffect(() => {
    if (selectedConversation && userId) {
      fetchMessages(selectedConversation.id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, userId]);

  const fetchConversations = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const messagesData = await chatService.getMessages(conversationId);
      
      const formatted = messagesData.map(msg => ({
        ...msg,
        fromUser: msg.senderId === userId
      }));
      
      setMessages(formatted);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId || !selectedConversation) return;

    try {
      const otherParticipant = selectedConversation.participants.find(p => p.userId !== userId);
      
      if (!otherParticipant) {
        console.error("Não foi possível encontrar o destinatário");
        return;
      }

      const messageData = {
        conversationId: selectedConversation.id,
        senderId: userId,
        recipientId: otherParticipant.userId,
        content: content.trim(),
      };

      const savedMessage = await chatService.sendMessage(messageData);

      // Add message to local list
      const newMessage = {
        id: savedMessage.id,
        text: savedMessage.content,
        fromUser: true,
        senderId: userId,
        recipientId: otherParticipant.userId,
        conversationId: selectedConversation.id
      };
      
      setMessages(msgs => [...msgs, newMessage]);

      // Send message via socket
      socketService.sendMessage({
        id: savedMessage.id,
        content: savedMessage.content,
        senderId: userId,
        recipientId: otherParticipant.userId,
        conversationId: selectedConversation.id
      });

      // Update last message in conversation
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: {
                  id: savedMessage.id,
                  content: savedMessage.content,
                  senderId: userId,
                  recipientId: otherParticipant.userId
                } 
              } 
            : conv
        )
      );
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const createNewConversation = async (recipientId: string) => {
    try {
      setIsLoading(true);
      
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p.userId === recipientId)
      );
      
      if (existingConversation) {
        // If exists, just select it
        setSelectedConversation(existingConversation);
        return;
      }
      
      // Create a new conversation
      const newConv = await chatService.createConversation(userId, recipientId);
      
      // Get recipient user data
      const recipient = await chatService.getUser(recipientId);
      
      // Add new conversation to list with recipient name
      const newConversation = {
        ...newConv,
        participants: [
          { userId, user: { id: userId, name: "Você" } },
          { userId: recipientId, user: recipient }
        ]
      };
      
      setConversations(prev => [...prev, newConversation]);
      
      // Select new conversation and clear messages
      setSelectedConversation(newConversation);
      setMessages([]);
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    userId,
    conversations,
    selectedConversation,
    messages,
    isLoading,
    setSelectedConversation,
    sendMessage,
    createNewConversation,
    refreshConversations: fetchConversations
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};