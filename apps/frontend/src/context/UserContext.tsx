"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserContextType {
  name: string | null;
  setName: (name: string | null) => void;
}

const UserContext = createContext<UserContextType>({
  name: null,
  setName: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<string | null>(null);

  // Initialize with value of localStorage if it exists
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
}
