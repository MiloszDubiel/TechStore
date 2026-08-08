import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const logoSchema = z
  .instanceof(File, {
    message: "Wybierz plik",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Maksymalny rozmiar pliku to 5MB",
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Niepoprawny format pliku. Dozwolone: JPG, JPEG, PNG, WEBP",
  });

const sellerFields = {
  shop_name: z.string().min(3, "Podaj nazwę sklepu").max(100),

  description: z.string().min(20, "Opis powinien mieć minimum 20 znaków").max(1000),

  company_name: z.string().min(3, "Podaj nazwę firmy"),

  nip: z.string().regex(/^\d{10}$/, "Niepoprawny NIP"),

  street: z.string().min(3, "Podaj ulicę"),

  city: z.string().min(2, "Podaj miasto"),

  postal_code: z.string().regex(/^\d{2}-\d{3}$/, "Kod powinien mieć format XX-XXX"),
};

// Tworzenie sklepu - logo wymagane

export const sellerSchema = z.object({
  ...sellerFields,

  logo: logoSchema,
});

export type SellerForm = z.infer<typeof sellerSchema>;

export const sellerProfileSchema = z.object({
  ...sellerFields,

  logo: logoSchema.optional(),
});

export type SellerProfileType = z.infer<typeof sellerProfileSchema>;
