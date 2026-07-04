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
