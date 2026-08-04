import React, { createContext, useContext, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "../hooks/useLogin";
import { socket } from "../socket";
import { useEffect } from "react";

export type User = {
  id: number;
  email: string;
  name: string;
  last_name: string;
  phone?: string;
  role: "USER" | "SELLER";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => any;
  isAuthenticated: boolean;
  isPending: boolean;
  isLoggingOut: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending: isLoggingOut } = useLogout();

  const { data: user, isPending } = useUser();

  const login = async (email: string, password: string) => {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    await queryClient.invalidateQueries({
      queryKey: ["user"],
    });
  };

  const logout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        queryClient.clear();

        socket.disconnect();
      },
    });
  };

  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.on("connect", () => {
      socket.emit("user", user.id);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        login,
        logout,
        isAuthenticated: !!user,
        isPending,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
