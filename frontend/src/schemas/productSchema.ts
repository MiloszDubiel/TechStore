import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nazwa produktu musi mieć minimum 3 znaki").max(255),

  brand: z.string().min(2, "Podaj producenta").max(100),

  model: z.string().min(1, "Podaj model").max(100),

  description: z.string().min(20, "Opis musi mieć minimum 20 znaków"),

  price: z.string().min(1, "Podaj cenę"),

  stock: z.string().min(1, "Podaj ilość"),

  category_id: z.string().min(1, "Wybierz kategorię"),

  subcategory_id: z.string().min(1, "Wybierz podkategorię"),

  images: z.array(z.instanceof(File)).min(1, "Dodaj minimum jedno zdjęcie"),

  attributes: z
    .array(
      z.object({
        name: z.string().min(1, "Podaj nazwę parametru"),

        value: z.string().min(1, "Podaj wartość parametru"),
      })
    )
    .min(1, "Dodaj minimum jeden parametr"),
});

export type ProductForm = z.infer<typeof productSchema>;
