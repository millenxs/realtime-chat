"use client";

import React from "react";
import ConversationList from "@/components/chat/ConversationList";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { ChatProvider } from "@/context/ChatContext";

export default function Chat() {
  return (
    <ChatProvider>
      <div className="flex h-full">
        <ConversationList />
        
        <div className="flex flex-col flex-1 p-4">
          <ChatHeader />
          <MessageList />
          <MessageInput />
        </div>
      </div>
    </ChatProvider>
  );
}