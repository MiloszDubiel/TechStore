import { z } from "zod";

export const adressesSchema = z.object({
  city: z.string().min(2, "Podaj miasto"),
  postal_code: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Kod musi być w formacie XX-XXX"),

  street: z.string().min(3, "Podaj ulicę"),
  isEdit: z.boolean(),
  is_default: z.boolean(),
});

export type AddressFrom = z.infer<typeof adressesSchema> & { aid?: string };
