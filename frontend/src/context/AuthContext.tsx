import React, { createContext, useContext, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "../hooks/useLogin";
import { socket } from "../socket";
export type User = {
  id: number;
  email: string;
  name: string;
  last_name: string;
  phone?: string | undefined;
  role: "USER" | "SELLER";
};

type AuthContextType = {
  user: User | null;
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean
  ) => void;
  logout: () => any;
  isAuthenticated: boolean;
  token: string | null;
  isPending: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();

  const [token, setToken] = useState(
    localStorage.getItem("token") ?? sessionStorage.getItem("token")
  );
  const { data: user, isPending } = useUser(token);

  const login = (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean
  ) => {
    if (rememberMe) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      sessionStorage.setItem("token", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });
    setToken(accessToken);

    socket.auth = {
      token: token,
    };
    socket.connect();
  };

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");

        setToken(null);

        queryClient.clear();
        socket.disconnect();
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        login,
        logout,
        isAuthenticated: !!user,
        token,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
