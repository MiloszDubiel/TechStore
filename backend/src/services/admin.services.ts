import { connection } from "../config/db.config";
export const getAllUsers = async () => {
  const [rows] = await connection.query(
    `
    SELECT
      u.id,
      u.name,
      u.last_name,
      u.email,
      u.role,
      u.created_at,
      u.is_active,


      sp.id AS seller_id,
      sp.shop_name,
      sp.slug,
      sp.description,
      sp.logo,
      sp.company_name,
      sp.nip,
      sp.street,
      sp.city,
      sp.postal_code


    FROM users u

    LEFT JOIN seller_profiles sp
      ON sp.user_id = u.id


    WHERE u.role <> "ADMIN"

    ORDER BY u.created_at DESC
    `,
  );

  return rows;
};

export const deleteUser = async (id: number) => {
  await connection.query(
    `
    DELETE FROM users
    WHERE id = ?
    `,
    [id],
  );

  return true;
};

export const updateUser = async (id: number, data: any) => {
  const { name, last_name, email, role } = data;

  await connection.query(
    `
UPDATE users
SET
name = ?,
last_name = ?,
email = ?,
role = ?,
is_super_admin = ? 

WHERE id = ?

`,
    [name, last_name, email, role, role == "ADMIN" ? 1 : 0, id],
  );

  return true;
};

export const unactivUser = async (id: number) => {
  await connection.query(
    `
UPDATE users
SET
is_active = 0

WHERE id = ?

`,
    [id],
  );

  return true;
};

export const activeUser = async (id: number) => {
  await connection.query(
    `
    UPDATE users
    SET
      is_active = 1
    WHERE id = ?
    `,
    [id],
  );

  return true;
};

export const getAllAdminProducts = async () => {
  const [rows] = await connection.query(
    `SELECT 
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

    GROUP BY p.id

    ORDER BY p.created_at DESC
    `,
  );

  return rows;
};

export const hideProduct = async (id: number) => {
  await connection.query(
    `
    UPDATE products

    SET is_visible = 0

    WHERE id = ?
    `,
    [id],
  );

  return true;
};

export const showProduct = async (id: number) => {
  await connection.query(
    `
    UPDATE products

    SET is_visible = 1

    WHERE id = ?
    `,
    [id],
  );

  return true;
};

export const deleteProduct = async (id: number) => {
  await connection.query(
    `
    UPDATE products

    SET is_deleted = 1,
        is_visible = 0

    WHERE id = ?

    `,
    [id],
  );

  return true;
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

    `/uploads/products/${sellerId}/${productId}/${file.filename}`,

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
  images: string[],
) => {
  if (!images.length) return;

  await connection.query(
    `
 DELETE FROM product_images
 WHERE product_id = ?
 AND image IN (?)
 `,
    [productId, images],
  );
};
export const updateProductService = async (productId: number, data: any) => {
  const {
    name,
    description,
    price,
    stock,
    brand,
    model,
    category_id,
    subcategory_id,
    attributes,
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
      updated_at = NOW()

    WHERE id = ?
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
      productId,
    ],
  );

  return result;
};
export const addProductImagesService = async (
  productId: number,
  sellerId: number,
  files: Express.Multer.File[],
) => {
  if (!files.length) return;

  const values = files.map((file, index) => [
    productId,
    file.filename,
    `/uploads/products/${sellerId}/${productId}/${file.filename}`,
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
export const updateSellerProfileAdmin = async (userId: number, data: any) => {
  const {
    shop_name,
    description,
    company_name,
    nip,
    street,
    city,
    postal_code,
    logo,
  } = data;

  const [result] = await connection.query(
    `
UPDATE seller_profiles

SET

shop_name=?,

description=?,

company_name=?,

nip=?,

street=?,

city=?,

postal_code=?,

logo=?,

updated_at=NOW()


WHERE user_id=?

`,

    [
      shop_name,

      description,

      company_name,

      nip,

      street,

      city,

      postal_code,

      logo,

      userId,
    ],
  );

  return result;
};
export const getSellerByUserId = async (userId: number) => {
  const [rows]: any = await connection.query(
    `
SELECT *

FROM seller_profiles

WHERE user_id=?

`,

    [userId],
  );

  return rows[0];
};
