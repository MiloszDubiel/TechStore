import { connection } from "../config/db.config";

interface UpdateUserData {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const updateUserInDB = async (data: UpdateUserData) => {
  const { id, firstName, lastName, phone } = data;

  const [result] = await connection.query(
    `
      UPDATE users
      SET
        first_name = ?,
        last_name = ?,
        phone = ?
      WHERE id = ?
    `,
    [firstName, lastName, phone || null, id],
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

    // Jeżeli nowy adres ma być domyślny,
    // wyłącz obecny domyślny adres
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

    // Jeżeli ustawiamy ten adres jako domyślny,
    // wyłącz wszystkie inne
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
