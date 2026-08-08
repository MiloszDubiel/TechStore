import { z } from "zod";

export const editUserAdminSchema = z
  .object({
    name: z.string().min(2, "Imię musi mieć minimum 2 znaki").max(50, "Imię jest za długie"),

    last_name: z.string().max(50, "Nazwisko jest za długie").optional().or(z.literal("")),

    email: z.string().email("Niepoprawny adres email"),

    role: z.enum(["USER", "SELLER", "ADMIN"]),

    password: z.string().min(6, "Hasło musi mieć minimum 6 znaków").optional().or(z.literal("")),

    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same",
    path: ["confirmPassword"],
  });

export type EditUserAdminForm = z.infer<typeof editUserAdminSchema>;
