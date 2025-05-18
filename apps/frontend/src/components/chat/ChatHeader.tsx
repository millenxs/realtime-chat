"use client"; 

import React from "react";
import { useChat } from "@/context/ChatContext";

export default function ChatHeader() {
  const { selectedConversation, userId } = useChat();
  
  if (!selectedConversation) return null;

  const recipient = selectedConversation.participants.find(
    (p) => p.userId !== userId
  )?.user;

  return (
    <div className="mb-4 font-bold text-lg">
      Chat with {recipient?.name || "User"}
    </div>
  );
}
