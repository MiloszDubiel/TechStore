import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.string().email("Niepoprawny email"),
  phone: z.string().regex(/^[0-9]{9}$/, "Telefon musi mieć 9 cyfr"),
  id: z.number(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
