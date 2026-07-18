import { connection } from "../config/db.config";
export const getAllUsers = async () => {
  const [rows] = await connection.query(
    `
    SELECT
      id,
      name,
      last_name,
      email,
      role,
      created_at,
      is_active

    FROM users
    WHERE role <> "ADMIN"

    ORDER BY created_at DESC
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

    p.brand,
    p.model,

    p.is_visible,
    p.is_deleted,

    p.created_at,
    p.updated_at,

    p.product_data,
    p.attributes,

    p.seller_id,

    u.email,

    sp.shop_name,
    sp.company_name,
    sp.logo,


    c.id AS category_id,
    c.name AS category_name,

    sc.id AS subcategory_id,
    sc.name AS subcategory_name,


    GROUP_CONCAT(
        pi.image_url
    ) AS images


FROM products p


LEFT JOIN seller_profiles sp
ON sp.user_id = p.seller_id


LEFT JOIN users u
ON u.id = p.seller_id


LEFT JOIN categories c
ON c.id = p.category_id


LEFT JOIN subcategories sc
ON sc.id = p.subcategory_id


LEFT JOIN product_images pi
ON pi.product_id = p.id


GROUP BY
    p.id,
    p.name,
    p.description,
    p.price,
    p.stock,
    p.brand,
    p.model,
    p.is_visible,
    p.is_deleted,
    p.created_at,
    p.updated_at,
    p.product_data,
    p.attributes,
    p.seller_id,
    u.email,
    sp.shop_name,
    sp.company_name,
    sp.logo,
    c.id,
    c.name,
    sc.id,
    sc.name


ORDER BY p.created_at DESC;
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

export const updateAdminProduct = async (productId: number, data: any) => {
  const {
    name,
    description,
    price,
    stock,
    category_id,
    subcategory_id,
    brand,
    model,
    is_visible,
    removedImages,
  } = data;

  let imagesToRemove: string[] = [];

  if (removedImages) {
    imagesToRemove = Array.isArray(removedImages)
      ? removedImages
      : JSON.parse(removedImages);
  }

  await connection.query(
    `
    UPDATE products
    SET
      name = ?,
      description = ?,
      price = ?,
      stock = ?,
      category_id = ?,
      subcategory_id = ?,
      brand = ?,
      model = ?,
      is_visible = ?
    WHERE id = ?
    `,
    [
      name,
      description,
      price,
      stock,
      category_id ?? null,
      subcategory_id ?? null,
      brand ?? null,
      model ?? null,
      is_visible ?? 1,
      productId,
    ],
  );

  // await updateProductImages(productId, imagesToRemove);
  return {
    id: productId,
  };
};
