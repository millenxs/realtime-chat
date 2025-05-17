"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ConversationList() {
  const { userId, conversations, selectedConversation, setSelectedConversation, createNewConversation } = useChat();
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const { users, isLoading, searchTerm, setSearchTerm, fetchUsers } = useUsers();
  const [conversationSearchTerm, setConversationSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  // Filtrar conversas quando a lista de conversas ou o termo de busca mudar
  useEffect(() => {
    if (!conversationSearchTerm) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(conv => {
      const otherUser = conv.participants.find(p => p.userId !== userId)?.user;
      const otherUserName = otherUser?.name || "Desconhecido";
      return otherUserName.toLowerCase().includes(conversationSearchTerm.toLowerCase());
    });
    
    setFilteredConversations(filtered);
  }, [conversations, conversationSearchTerm, userId]);

  const handleOpenDialog = async () => {
    setIsNewConversationOpen(true);
    await fetchUsers(userId);
  };

  const handleSelectUser = async (recipientId) => {
    await createNewConversation(recipientId);
    setIsNewConversationOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="w-64 border-r border-gray-700 p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Conversas</h2>
        <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto"
              onClick={handleOpenDialog}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conversa</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              
              {isLoading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {users.map(user => (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user.id)}
                      className="cursor-pointer p-2 hover:bg-gray-800 rounded"
                    >
                      {user.name}
                    </div>
                  ))}
                  
                  {!isLoading && users.length === 0 && (
                    <div className="text-center text-gray-400 py-2">
                      Nenhum usuário encontrado
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Campo de busca para conversas existentes */}
      <div className="relative mb-4">
        <Input
          placeholder="Buscar conversas..."
          value={conversationSearchTerm}
          onChange={(e) => setConversationSearchTerm(e.target.value)}
          className="pl-8 w-full"
        />
        <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const otherUser = conv.participants.find(p => p.userId !== userId)?.user;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`cursor-pointer p-2 rounded mb-1 hover:bg-gray-800 ${
                  selectedConversation?.id === conv.id ? "bg-gray-700" : ""
                }`}
              >
                {otherUser?.name || "Desconhecido"}
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-center py-2">
            {conversations.length === 0 
              ? "Nenhuma conversa encontrada." 
              : "Nenhuma conversa corresponde à busca."}
          </div>
        )}
      </div>
    </div>
  );
}