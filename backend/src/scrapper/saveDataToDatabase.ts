import { connection } from "../config/db.config";
import slugify from "slugify";

export const saveToDatabase = async (data: any) => {
  const sellerId = 12;

  const slug = slugify(`${data.name}-${sellerId}`, {
    lower: true,
    strict: true,
  });

  const productData = {
    source: "MediaMarkt",
    url: data.link,
  };

  const attributes = data.spec ?? [];

  const sql = `
    INSERT INTO products
    (
      external_id,
      name,
      description,
      price,
      stock,
      is_visible,
      is_deleted,
      product_data,
      attributes,
      brand,
      model,
      seller_id,
      category_id,
      subcategory_id,
      slug
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.external_id ?? null,

    data.name,

    data.description ?? "",

    Number(
      data.price?.replace(/\s/g, "").replace("zł", "").replace(",", "."),
    ) || 0,

    1,

    1,

    0,

    JSON.stringify(productData),

    JSON.stringify(attributes),

    data.brand ?? null,

    data.model ?? null,

    sellerId,

    2,

    2,

    slug,
  ];

  const [result]: any = await connection.query(sql, values);

  const productId = result.insertId;

  if (data.img) {
    await connection.query(
      `
      INSERT INTO product_images
      (
        product_id,
        image,
        url,
        is_main
      )
      VALUES (?, ?, ?, ?)
      `,
      [productId, data.img.split("/").pop(), data.img, 1],
    );
  }

  return productId;
};
