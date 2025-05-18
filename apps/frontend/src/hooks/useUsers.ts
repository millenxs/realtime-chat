"use client";

import { useState } from "react";
import { User } from "@/types";
import { chatService } from "@/services/chat";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (currentUserId: string) => {
    try {
      setIsLoading(true);
      const response = await chatService.getUsers();
      // Filter out current user
      const filteredUsers = response.filter(user => user.id !== currentUserId);
      setUsers(filteredUsers);
      return filteredUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    users: filteredUsers,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchUsers
  };
};
