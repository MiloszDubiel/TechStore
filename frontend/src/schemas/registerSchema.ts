import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Imię musi mieć minimum 2 znaki"),

    email: z.string().email("Niepoprawny format adresu email"),

    password: z
      .string()
      .min(8, "Hasło musi mieć minimum 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać wielką literę")
      .regex(/[0-9]/, "Hasło musi zawierać cyfrę")
      .regex(/[\W_]/, "Hasło musi zawierać znak specjalny"),

    confirmPassword: z.string(),

    role: z.enum(["USER", "SELLER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hasła nie są takie same",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
