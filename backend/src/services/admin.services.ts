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
      created_at

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
