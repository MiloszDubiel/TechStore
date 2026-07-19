import { connection } from "../config/db.config";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import slugify from "slugify";

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  model: string;

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
    "SELECT * FROM seller_profiles WHERE user_id = ?",
    [userId],
  );

  return rows[0] ?? null;
};

export const getCompanyInfo = async (userId: number) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM seller_profiles WHERE user_id = ?",
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
  city,
  postal_code,
  street,
  company_name,
}: {
  userId: number;
  shop_name: string;
  slug: string;
  description: string;
  logo: string | null;
  nip: string | null;
  city?: string;
  postal_code?: string;
  street?: string;
  company_name: string;
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
      nip,
      city,
      postal_code,
      street,
      company_name
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      shop_name,
      slug,
      description,
      logo,
      nip,
      city || null,
      postal_code || null,
      street || null,
      company_name,
    ],
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
      p.brand,
      p.model,
      p.is_deleted,
      p.is_visible,

      c.id AS category_id,
      s.id AS subcategory_id,

      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', pi.id,
            'image', pi.image,
            'url', pi.url,
            'is_main', pi.is_main
          )
        ),
        JSON_ARRAY()
      ) AS images

    FROM products p

    LEFT JOIN categories c 
      ON p.category_id = c.id
      LEFT JOIN subcategories s
      ON p.subcategory_id = s.id

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
      [productId, file.filename],
    );
  }
};

export const deleteProductFromDB = async (
  productId: number,
  sellerId: number,
) => {
  const [result] = await connection.query(
    `
    UPDATE products
SET is_deleted = 1,
    is_visible = 0
 WHERE id = ?
      AND seller_id = ?
    `,
    [productId, sellerId],
  );

  return result;
};

export const editSellerProfile = async (data: {
  userId: number;
  shop_name: string;
  slug: string;
  description: string;
  logo: string | null;
  nip: string | null;
  city?: string;
  postal_code?: string;
  street?: string;
  company_name: string;
}) => {
  try {
    const slug = slugify(
      data.shop_name + " " + data.company_name + " " + data.userId,
      {
        lower: true,
        strict: true,
        trim: true,
      },
    );

    const [result] = await connection.query(
      `
    UPDATE seller_profiles
    SET
      shop_name = ?,
      slug = ?,
      description = ?,
      logo = ?,
      nip = ?,
      city = ?,
      postal_code = ?,
      street = ?,
      company_name = ?
    WHERE user_id = ?
    `,
      [
        data.shop_name,
        slug,
        data.description,
        data.logo,
        data.nip,
        data.city,
        data.postal_code,
        data.street,
        data.company_name,
        data.userId,
      ],
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getSellerById = async (id: number, slug: string) => {
  const [rows]: any = await connection.query(
    `
SELECT
    sp.user_id AS seller_id,
    sp.shop_name,
    sp.slug,
    sp.description,
    sp.logo,
    sp.company_name,
    sp.is_verified,
    sp.created_at,


    COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id',p.id,
                'name',p.name,
                'price',p.price,
                'stock',p.stock,
                'brand',p.brand,
                'model',p.model,
                
                'images',
                (
                    SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'image',
                            pi2.image_url
                        )
                    )

                    FROM product_images pi2
                    WHERE pi2.product_id = p.id
                )

            )
        ),
        JSON_ARRAY()
    ) AS products



FROM seller_profiles sp


LEFT JOIN products p
    ON p.seller_id = sp.user_id



WHERE 
    sp.user_id = ?
AND
    sp.slug = ?



GROUP BY sp.id

`,
    [id, slug],
  );

  if (!rows.length) {
    return null;
  }

  const seller = rows[0];

  seller.products =
    typeof seller.products === "string"
      ? JSON.parse(seller.products)
      : seller.products;

  seller.products = seller.products.map((product: any) => ({
    ...product,

    images:
      typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images,
  }));

  return seller;
};
export const createProduct = async (
  sellerId: number,
  data: CreateProductDTO,
  slug: string,
) => {
  const {
    name,
    brand,
    model,
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
      attributes,
      brand,
      model,
      slug,
      is_visible,
      is_deleted
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
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
      brand,
      model,
      slug,
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
    brand,
    model,
    attributes,
  };
};

export const updateProductService = async (data: any) => {
  const {
    id,
    sellerId,
    name,
    description,
    price,
    stock,
    brand,
    model,
    category_id,
    subcategory_id,
    attributes,
    product_data,
  } = data;

  const [result] = await connection.query(
    `
    UPDATE products
    SET
      name = ?,
      description = ?,
      price = ?,
      stock = ?,
      brand = ?,
      model = ?,
      category_id = ?,
      subcategory_id = ?,
      attributes = ?,
      product_data = ?,
      updated_at = NOW()

    WHERE id = ?
    AND seller_id = ?
    `,
    [
      name,
      description,
      price,
      stock,
      brand,
      model,
      category_id,
      subcategory_id,
      JSON.stringify(attributes),
      JSON.stringify(product_data),

      id,
      sellerId,
    ],
  );

  return result;
};

export const updateProductImages = async (
  productId: number,
  sellerId: number,
  images: Express.Multer.File[],
) => {
  const [products]: any = await connection.query(
    `
    SELECT id
    FROM products
    WHERE id = ?
    AND seller_id = ?
    `,
    [productId, sellerId],
  );

  if (products.length === 0) {
    throw new Error("Produkt nie istnieje");
  }

  if (!images.length) {
    return [];
  }

  console.log(images);

  const values = images.map((file, index) => [
    productId,

    file.filename,

    `uploads/products/${sellerId}/${productId}/${file.filename}`,

    index === 0 ? 1 : 0,
  ]);

  await connection.query(
    `
    INSERT INTO product_images
    (
      product_id,
      image,
      url,
      is_main
    )
    VALUES ?
    `,
    [values],
  );

  return values;
};
export const deleteProductImagesService = async (
  productId: number,
  sellerId: number,
  images: string[],
) => {
  if (!images.length) return;

  await connection.query(
    `
    DELETE pi
    FROM product_images pi

    INNER JOIN products p
    ON p.id = pi.product_id

    WHERE pi.product_id = ?
    AND p.seller_id = ?
    AND pi.image IN (?)
    `,
    [productId, sellerId, images],
  );
};
export const getSellerByUserIdService = async (userId: number) => {
  const [rows]: any = await connection.query(
    `
    SELECT
      sp.id,
      sp.user_id,
      sp.shop_name,
      sp.description,
      sp.company_name,
      sp.nip,
      sp.street,
      sp.city,
      sp.postal_code,
      sp.logo,
      sp.created_at,
      sp.updated_at
    FROM seller_profiles sp
    WHERE sp.user_id = ?
    `,
    [userId],
  );

  return rows[0] ?? null;
};