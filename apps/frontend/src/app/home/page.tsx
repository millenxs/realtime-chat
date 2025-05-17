"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Navbar from "@/components/navbar/Navbar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading)
    return <div className="text-white p-4">Verificando autenticação...</div>;

  return (
    <div className="flex flex-col h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 bg-gray-800 text-white flex flex-col">
          <ChatWindow />
        </section>
      </main>
    </div>
  );
}
