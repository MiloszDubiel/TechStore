import { connection } from "../config/db.config";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";

interface UpdateUserData {
  id: number;
  name: string;
  last_name: string;
  phone?: string;
  email: string;
}
interface EditPasswordProps {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const updateUserInDB = async (data: UpdateUserData) => {
  const { id, name, last_name, phone, email } = data;

  const [result] = await connection.query(
    `
      UPDATE users
      SET
        name = ?,
        last_name = ?,
        phone = ?,
        email = ?
      WHERE id = ?
    `,
    [name, last_name, phone || null, email, id],
  );

  return result;
};

export const getAdressesFromDB = async (id: string) => {
  const [result] = await connection.query(
    "SELECT * FROM addresses WHERE user_id = ?",
    [id],
  );

  return result;
};

export const saveAdressesToDB = async (
  id: string,
  street: string,
  postal_code: string,
  city: string,
  is_default: boolean,
) => {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    if (is_default) {
      await conn.query(
        `
        UPDATE addresses
        SET is_default = false
        WHERE user_id = ?
        `,
        [id],
      );
    }

    const [result] = await conn.query<ResultSetHeader>(
      `
      INSERT INTO addresses
      (
        user_id,
        street,
        postal_code,
        city,
        is_default
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [id, street, postal_code, city, is_default],
    );

    await conn.commit();

    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const updateAdressesToDB = async (
  id: string,
  street: string,
  postalCode: string,
  city: string,
  is_default: boolean,
  aid: string,
) => {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    if (is_default) {
      await conn.query(
        `
        UPDATE addresses
        SET is_default = false
        WHERE user_id = ?
        `,
        [id],
      );
    }

    const result = await conn.query(
      `
      UPDATE addresses
      SET 
        street = ?,
        postal_code = ?,
        city = ?,
        is_default = ?
      WHERE user_id = ?
      AND id = ?
      `,
      [street, postalCode, city, is_default, id, aid],
    );

    await conn.commit();

    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const deleteAddressFromDB = async (aid: string) => {
  const result = await connection.query(
    `
      DELETE FROM addresses WHERE id = ? 
      `,
    [aid],
  );
};

export const editPassword = async ({
  userId,
  currentPassword,
  newPassword,
  confirmPassword,
}: EditPasswordProps) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Hasła nie są takie same");
  }

  const [rows]: any = await connection.query(
    "SELECT password FROM users WHERE id = ?",
    [userId],
  );

  const user = rows[0];

  if (!user) {
    throw new Error("Użytkownik nie znaleziony");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Aktualne hasło jest niepoprawne");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await connection.query(
    `
  UPDATE users 
  SET password = ?, password_updated_at = NOW()
  WHERE id = ?
  `,
    [hashedPassword, userId],
  );

  const [row]: any = await connection.query(
    `
  SELECT password_updated_at 
  FROM users
  WHERE id = ?
  `,
    [userId],
  );

  await connection.query(
    `UPDATE refresh_tokens
   SET is_revoked = 1
   WHERE user_id = ?`,
    [userId],
  );

  return {
    success: true,
    message: "Hasło zostało zmienione. Zaloguj się ponownie.",
    passwordUpdatedAt: row[0].password_updated_at,
  };
};

export const getPassword = async (userId: string) => {
  try {
    const [rows]: any = await connection.query(
      `
      SELECT password_updated_at 
      FROM users
      WHERE id = ?
      `,
      [userId],
    );

    if (!rows[0]) {
      throw new Error("Użytkownik nie znaleziony");
    }

    return {
      passwordUpdatedAt: rows[0].password_updated_at,
    };
  } catch (error) {
    throw new Error("Wewnętrzny błąd serwera");
  }
};

export const getOrdersFromDB = async (userId: string | null) => {
  try {
    const [orders] = await connection.query(
      `
      SELECT
        o.id,
        o.total_price,
        o.status,
        o.created_at,
        o.order_number,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN order_items oi
        ON oi.order_id = o.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [userId],
    );

    return {
      orders,
      message: "Pobrano zamówienia",
    };
  } catch (err) {
    console.log(err);
    return {
      message: "Błąd pobierania zamówień",
    };
  }
};

export const getOrderDetailsFromDB = async (
  orderId: string,
  userId: number,
) => {
  const [rows]: any = await connection.query(
    `SELECT

    o.id AS order_id,
    o.order_number,
    o.total_price,
    o.status,
    o.created_at,

    oi.quantity,
    oi.price AS item_price,


    JSON_OBJECT(
        'id', p.id,
        'name', p.name,
        'description', p.description,
        'brand', p.brand,
        'model', p.model,
        'stock', p.stock,
        'attributes', p.attributes,

        'category_name', c.name,
        'subcategory_name', sc.name,

        'images',
        (
            SELECT COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'image', pi.image,
                        'url', pi.url
                    )
                ),
                JSON_ARRAY()
            )
            FROM product_images pi
            WHERE pi.product_id = p.id
        )

    ) AS product,


    JSON_OBJECT(
        'seller_id', sp.user_id,
        'shop_name', sp.shop_name,
        'company_name', sp.company_name,
        'logo', sp.logo,
        'slug', sp.slug,
        'is_verified', sp.is_verified
    ) AS seller


FROM orders o


LEFT JOIN order_items oi
    ON oi.order_id = o.id


LEFT JOIN products p
    ON p.id = oi.product_id


LEFT JOIN categories c
    ON c.id = p.category_id


LEFT JOIN subcategories sc
    ON sc.id = p.subcategory_id


LEFT JOIN seller_profiles sp
    ON sp.user_id = p.seller_id


WHERE 
    o.id = ?
    AND o.user_id = ?


GROUP BY
    o.id,
    oi.id,
    p.id,
    sp.id`,
    [orderId, userId],
  );

  if (!rows.length) {
    return null;
  }

  const order = {
    id: rows[0].order_id,
    order_number: rows[0].order_number,
    total_price: rows[0].total_price,
    status: rows[0].status,
    created_at: rows[0].created_at,
  };

  const items = rows.map((item: any) => ({
    quantity: item.quantity,
    price: item.item_price,

    product:
      typeof item.product === "string"
        ? JSON.parse(item.product)
        : item.product,

    seller:
      typeof item.seller === "string" ? JSON.parse(item.seller) : item.seller,
  }));

  return {
    order,
    items,
  };
};
