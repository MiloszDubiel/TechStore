import { prisma } from "../lib/prisma";
import slugify from "slugify";

export const saveToDatabase = async (data: any) => {
  const sellerId = 1;

  const slug = slugify(`${data.name}-${sellerId}`, {
    lower: true,
    strict: true,
  });

  const productData = {
    url: [{ url: data.img }],
  };

  const attributes = data.spec ?? [];

  const price =
    Number(
      data.price?.replace(/\s/g, "").replace("zł", "").replace(",", "."),
    ) || 0;

  const product = await prisma.$transaction(async (tx) => {
    const createdProduct = await tx.product.create({
      data: {
        externalId: data.external_id ?? null,
        name: data.name,
        description: data.description ?? "",
        price,
        stock: Math.floor(Math.random() + 1 * 10),
        isVisible: true,
        isDeleted: false,
        productData,
        attributes,
        brand: data.brand ?? null,
        model: data.model ?? null,
        sellerId,
        categoryId: data.categoryId ?? null,
        subcategoryId: data.subcategoryId ?? null,

        slug,
      },
      select: {
        id: true,
      },
    });

    return createdProduct;
  });

  return product.id;
};
