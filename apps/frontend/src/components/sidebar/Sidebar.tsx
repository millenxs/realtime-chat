"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";

const mockConversations = [
  { id: "1", title: "Conversa com IA #1" },
  { id: "2", title: "Conversa com IA #2" },
  { id: "3", title: "Projeto de Frontend" },
];

export default function Sidebar() {
  const [search, setSearch] = useState("");

  const filteredConversations = mockConversations.filter((conv) =>
    conv.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col h-full">
      <Input
        type="text"
        placeholder="Buscar conversas"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhuma conversa encontrada</p>
        )}

        <ul className="space-y-2">
          {filteredConversations.map((conv) => (
            <li
              key={conv.id}
              className="cursor-pointer px-3 py-2 rounded hover:bg-gray-700"
            >
              {conv.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}