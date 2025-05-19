"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { name } = useUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    router.push("/login");
  }

  return (
    <nav className="bg-gray-900 text-white flex justify-between items-center px-4 h-14 border-b border-gray-700">
      <div className="font-bold text-lg">RealTime Chat</div>

      <div className="relative">
        <Button
          onClick={() => setOpen((prev) => !prev)}
          className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-3 py-1 hover:bg-gray-700"
        >
          {name ? `${name} ▼` : "Perfil ▼"}
        </Button>

        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded shadow-lg border border-gray-700 z-10">
            <Button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
