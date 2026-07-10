import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Imię musi mieć minimum 2 znaki"),

  last_name: z.string().min(2, "Nazwisko musi mieć minimum 2 znaki"),

  email: z.email("Niepoprawny adres email"),

  phone: z.string().regex(/^\d{9}$/, "Telefon musi mieć 9 cyfr"),
});

export type CustomerForm = z.infer<typeof customerSchema>;
