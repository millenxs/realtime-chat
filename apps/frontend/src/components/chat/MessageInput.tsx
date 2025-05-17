"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MessageInput() {
  const [input, setInput] = useState("");
  const { sendMessage, selectedConversation } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on input when conversation changes
  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedConversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !selectedConversation) return;
    
    await sendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        id="message-input"
        placeholder="Digite sua mensagem..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1"
        disabled={!selectedConversation}
      />
      <Button 
        type="submit" 
        disabled={!input.trim() || !selectedConversation}
      >
        Enviar
      </Button>
    </form>
  );
}