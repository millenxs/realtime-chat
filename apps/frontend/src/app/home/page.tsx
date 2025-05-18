"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token stored in localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token is found, redirect to login page
      router.push("/login");
    } else {
      // Token found, allow access
      setLoading(false);
    }
  }, [router]);

  // While checking authentication, display a loading message
  if (loading)
    return <div className="text-white p-4">Checking authentication...</div>;

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