import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Niepoprawny email"),
  password: z.string().min(1, "Hasło jest wymagane"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
