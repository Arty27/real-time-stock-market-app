"use client";

import { createContext, useContext } from "react";

const SessionContext = createContext<User | null>(null);

type User = {
  id: string;
  email: string;
  name: string;
};

export function SessionProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within Session Provider");
  }
  return context;
}
