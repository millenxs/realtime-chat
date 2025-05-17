"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";

export default function MessageList() {
  const { messages, selectedConversation } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Selecione uma conversa para começar.
      </div>
    );
  }

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
            ? `Esta é uma nova conversa com ${recipient.name}. Diga olá!`
            : "Nenhuma mensagem encontrada. Comece a conversar!"}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}