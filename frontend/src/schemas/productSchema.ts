import { z } from "zod";

const attributesSchema = z
  .object({
    parameter_id: z.number(),
    name: z.string(),
    value: z.string(),
  })
  .passthrough();

const baseProductSchema = {
  name: z.string().min(3, "Nazwa musi mieć minimum 3 znaki"),

  brand: z.string().min(2, "Podaj producenta"),

  model: z.string().min(1, "Podaj model"),

  description: z.string().min(10, "Opis musi mieć minimum 10 znaków"),

  price: z.string().min(1, "Podaj cenę"),

  stock: z.string().min(1, "Podaj stan magazynu"),

  category_id: z.string().min(1, "Wybierz kategorię"),

  subcategory_id: z.string().min(1, "Wybierz podkategorię"),

  attributes: z.array(attributesSchema).refine(
    (attributes) => {
      const names = attributes.map((a) => a.name.toUpperCase());

      return names.length == new Set(names).size;
    },
    {
      message: "Każdy parametr może wystąpić tylko raz.",
    }
  ),
};

export const productCreateSchema = z.object({
  ...baseProductSchema,

  images: z.array(z.instanceof(File)).min(1, "Dodaj minimum jedno zdjęcie"),
});

export const productEditSchema = z
  .object({
    ...baseProductSchema,

    images: z.array(z.instanceof(File)).optional(),

    existingImages: z.array(z.string()).optional(),

    removedImages: z.array(z.string()).optional(),
  })
  .refine(
    (data) =>
      (data.images?.length ?? 0) > 0 || (data.existingImages?.length ?? 0) > 0,
    {
      message: "Produkt musi posiadać minimum jedno zdjęcie",
      path: ["images"],
    }
  );

export type ProductCreateForm = z.infer<typeof productCreateSchema>;

export type EditProductForm = z.infer<typeof productEditSchema>;
