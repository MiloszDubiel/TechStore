import { z } from "zod";

export const buySchema = z.object({
  firstName: z.string().min(2, "Imie jest za krótkie"),
  lastName: z.string().min(2, "Nazwisko za krótkie"),
  email: z.string().email("Niepoprawny email"),
  phone: z.string().min(9, "Za krótki numer"),
  city: z.string().min(2, "Podaj miasto"),
  postalCode: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Kod musi być w formacie XX-XXX"),
  street: z.string().min(3, "Podaj ulicę"),
  deliveryMethod: z.enum(["courier", "parcel"]),
  paymentMethod: z.enum(["blik", "transfer"]),
});

export type BuyFrom = z.infer<typeof buySchema>;
