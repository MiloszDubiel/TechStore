import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import type { RegisterSchema } from "../schemas/registerSchema";

const registerUser = async (data: RegisterSchema) => {
  const response = await axios.post("/api/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return response.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
