import { connection } from "../config/db.config";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;

  category_id: number;
  subcategory_id?: number;

  image?: string;

  attributes: {
    name: string;
    value: string;
  }[];
}

export const getSellerByUserId = async (userId: number) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT id FROM seller_profiles WHERE user_id = ?",
    [userId],
  );

  return rows[0] ?? null;
};

export const createSellerProfile = async ({
  userId,
  shop_name,
  slug,
  description,
  logo,
  nip,
}: {
  userId: number;
  shop_name: string;
  slug: string;
  description: string;
  logo: string | null;
  nip?: string | null;
}) => {
  const [result] = await connection.query<ResultSetHeader>(
    `
    INSERT INTO seller_profiles
    (
      user_id,
      shop_name,
      slug,
      description,
      logo,
      nip
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [userId, shop_name, slug, description, logo, nip],
  );

  return result.insertId;
};

export const updateUserRoleToSeller = async (userId: number) => {
  await connection.query(
    `
    UPDATE users
    SET role = 'SELLER'
    WHERE id = ?
    `,
    [userId],
  );
};

export const getSellerProducts = async (sellerId: number) => {
  const [products] = await connection.query(
    `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.attributes,
      p.created_at,

      c.name AS category,

      COALESCE(
        JSON_ARRAYAGG(
          pi.image_url
        ),
        JSON_ARRAY()
      ) AS images

    FROM products p

    LEFT JOIN categories c 
      ON p.category_id = c.id

    LEFT JOIN product_images pi
      ON p.id = pi.product_id

    WHERE p.seller_id = ?

    GROUP BY p.id

    ORDER BY p.created_at DESC
    `,
    [sellerId],
  );

  return products;
};

export const createProduct = async (
  sellerId: number,
  data: CreateProductDTO,
) => {
  const {
    name,
    description,
    price,
    stock,
    category_id,
    subcategory_id,
    attributes,
  } = data;

  const [result] = await connection.query(
    `
    INSERT INTO products
    (
      seller_id,
      name,
      description,
      price,
      stock,
      category_id,
      subcategory_id,
      attributes
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      sellerId,
      name,
      description,
      price,
      stock,
      category_id,
      subcategory_id ?? null,
      JSON.stringify(attributes),
    ],
  );

  const productId = (result as any).insertId;

  return {
    id: productId,

    name,
    description,
    price,
    stock,
    category_id,
    subcategory_id,
    attributes,
  };
};

export const saveProductImages = async (
  productId: number,
  files: Express.Multer.File[],
) => {
  for (const file of files) {
    await connection.query(
      `
    INSERT INTO product_images
    (
      product_id,
      image_url
    )

    VALUES (?,?)
    `,
      [productId, `/uploads/products/${productId}/${file.filename}`],
    );
  }
};
