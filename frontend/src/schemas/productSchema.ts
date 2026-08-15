import { z } from "zod";

export const attributesSchema = z
  .object({
    parameter_id: z.number().positive("ID parametru musi być większe od 0"),
    name: z.string(),
    value: z.coerce.number(),
    type: z.string(),
  })
  .passthrough()
  .refine(
    (attribute) => {
      if (attribute.type === "number") {
        const value = Number(attribute.value);
        return !isNaN(value) && value >= 0;
      }

      return true;
    },
    {
      message: "Wartość musi być liczbą większą lub równą 0",
      path: ["value"],
    },
  );

const baseProductSchema = {
  name: z.string().min(3, "Nazwa musi mieć minimum 3 znaki"),
  brand: z.string().min(2, "Podaj producenta"),
  model: z.string().min(1, "Podaj model"),
  description: z.string().min(10, "Opis musi mieć minimum 10 znaków"),
  price: z.coerce.number().min(1, "Wartość musi być liczbą większą lub równą 0"),
  stock: z.coerce.number().min(0, "Wartość musi być liczbą większą lub równą 0"),
  category_id: z.string().min(1, "Wybierz kategorię"),
  subcategory_id: z.string().min(1, "Wybierz podkategorię"),
  attributes: z.array(
    z.object({
      parameter_id: z.number(),
      name: z.string(),
      label: z.string(),
      type: z.string(),
      required: z.number(),
      options: z.array(
        z.object({
          id: z.number().nullable(),
          value: z.string().nullable(),
        }),
      ),
      value: z.union([z.string(), z.number()]),
    }),
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
  .refine((data) => (data.images?.length ?? 0) > 0 || (data.existingImages?.length ?? 0) > 0, {
    message: "Produkt musi posiadać minimum jedno zdjęcie",
    path: ["images"],
  });

export type ProductCreateForm = z.infer<typeof productCreateSchema>;

export type EditProductForm = z.infer<typeof productEditSchema>;
