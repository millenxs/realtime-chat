"use client";

import React, { useState, useRef, useEffect } from "react";
import io  from "socket.io-client";
import type { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import api from "@/services/api";

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
  senderId?: string;
}

interface DecodedToken {
  id: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Olá! Como posso ajudar?", fromUser: false },
  ]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const socketRef = useRef<typeof Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para usar o chat.");
      return;
    }

    const decoded = jwtDecode<DecodedToken>(token);
    setUserId(decoded.id);

    const fetchMessages = async () => {
      try {
        const response = await api.get<
          { id: string; content: string; senderId: string }[]
        >("/messages");

        const loadedMessages: Message[] = response.data.map(
          (msg: { id: string; content: string; senderId: string }) => ({
            id: msg.id,
            text: msg.content,
            fromUser: msg.senderId === decoded.id,
            senderId: msg.senderId,
          })
        );

        setMessages((prev) => [...prev, ...loadedMessages]);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };

    fetchMessages();

    // Conexão WebSocket
    const socket = io("http://localhost:3333", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Conectado ao WebSocket");
    });

    socket.on(
      "message",
      (msg: { id: string; text: string; senderId: string }) => {
        const isFromUser = msg.senderId === decoded.id;

        setMessages((msgs) => [
          ...msgs,
          {
            id: msg.id,
            text: msg.text,
            fromUser: isFromUser,
            senderId: msg.senderId,
          },
        ]);
      }
    );

    socket.on("disconnect", () => {
      console.log("Desconectado do WebSocket");
    });

    socket.on("connect_error", (err) => {
      console.error("Erro na conexão do WebSocket:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function sendMessage() {
    if (!input.trim() || !userId) return;

    const messageToSend: Message = {
      id: uuidv4(),
      text: input.trim(),
      fromUser: true,
      senderId: userId,
    };

    socketRef.current?.emit("message", messageToSend);

    socketRef.current?.emit("message", {
      id: messageToSend.id,
      text: messageToSend.text,
      senderId: userId,
    });

    setInput("");
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 max-w-[70%] px-3 py-2 rounded ${
              msg.fromUser ? "bg-purple-600 self-end" : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim()}>Enviar</Button>
      </form>
    </div>
  );
}
