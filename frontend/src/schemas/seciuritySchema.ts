import { z } from "zod";
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Podaj aktualne hasło"),

    newPassword: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
      .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
      .regex(
        /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>/?`~]/,
        "Hasło musi zawierać co najmniej jeden znak specjalny"
      ),

    confirmPassword: z.string().min(1, "Potwierdź nowe hasło"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hasła nie są takie same",
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
