"use client";

import React, { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    const decoded = jwtDecode<DecodedToken>(token);
    setUserId(decoded.id);

    // 👉 Buscar mensagens salvas usando axios
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3333/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

    // 👉 Conectar ao WebSocket
    socketRef.current = io("http://localhost:3333", {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Conectado ao WebSocket");
    });

    socketRef.current.on(
      "message",
      (msg: { id: string; text: string; senderId: string }) => {
        const isFromUser = msg.senderId === decoded.id;

        setMessages((msgs) => [
          ...msgs,
          {
            id: msg.id,
            text: msg.text,
            fromUser: isFromUser,
          },
        ]);
      }
    );

    socketRef.current.on("disconnect", () => {
      console.log("Desconectado do WebSocket");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Erro na conexão do WebSocket:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  function sendMessage() {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: String(Date.now()),
      text: input.trim(),
      fromUser: true,
    };

    setMessages((msgs) => [...msgs, newMessage]);

    socketRef.current?.emit("message", {
      text: input.trim(),
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
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
