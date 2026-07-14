import { z } from "zod";
const MAX_FILE_SIZE = 5000000; // 5 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const sellerSchema = z.object({
  shop_name: z.string().min(3, "Podaj nazwę sklepu").max(100),

  description: z
    .string()
    .min(20, "Opis powinien mieć minimum 20 znaków")
    .max(1000),

  nip: z.string().min(10, "Niepoprawny NIP").max(10, "Niepoprawny NIP"),

  logo: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Wybierz logo")
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "Maksymalny rozmiar pliku to 5 MB."
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Dozwolone formaty to .jpg, .jpeg, .png i .webp."
    ),
});

export type SellerForm = z.infer<typeof sellerSchema>;
