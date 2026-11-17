import { prisma } from "../lib/prisma";
import slugify from "slugify";

export const saveToDatabase = async (data: any) => {
  const sellerId = 1;

  const slug = slugify(`${data.name}-${sellerId}`, {
    lower: true,
    strict: true,
  });

  const productData = {
    source: "MediaMarkt",
    url: data.link,
    type: data.type,
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
        stock: 1,
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

    if (data.img) {
      await tx.productImage.create({
        data: {
          productId: createdProduct.id,
          image: data.img.split("/").pop()!,
          url: data.img,
          isMain: true,
        },
      });
    }

    return createdProduct;
  });

  return product.id;
};
