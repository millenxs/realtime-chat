"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";

export default function MessageList() {
  const { messages, selectedConversation } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom whenever new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If no conversation is selected, show a prompt to the user
  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation to start chatting.
      </div>
    );
  }

  // Identify the recipient (the other participant in the chat)
  const recipient = selectedConversation.participants.find(
    (p) => p.userId !== useChat().userId
  )?.user;

  return (
    <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2 p-2">
      {messages.length > 0 ? (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] px-3 py-2 rounded ${
              msg.fromUser ? "bg-purple-600 self-end" : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 my-4">
          {recipient?.name
            ? `This is a new conversation with ${recipient.name}. Say hi!`
            : "No messages found. Start a conversation!"}
        </div>
      )}
      {/* Reference point to scroll into view when new messages arrive */}
      <div ref={messagesEndRef} />
    </div>
  );
}
