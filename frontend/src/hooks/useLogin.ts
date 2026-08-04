import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import type { LoginFormData } from "../schemas/loginSchema";

interface LoginResponse {
  rememberMe: boolean | undefined;
  id: string;
}

const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await axios.post("/api/auth/login", {
    email: data.email,
    password: data.password,
  });

  return {
    rememberMe: data.rememberMe,
    id: response.data.id,
  };
};

const logoutUser = async () => {
  const response = await axios.post("/api/auth/logout", {});

  return { message: response.data.message };
};
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};
