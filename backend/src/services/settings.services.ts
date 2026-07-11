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

  return {
    success: true,
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
