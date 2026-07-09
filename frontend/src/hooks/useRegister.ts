import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import type { RegisterSchema } from "../schemas/registerSchema";

const registerUser = async (data: RegisterSchema) => {
  const response = await api.post("/api/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  });

  return response.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
