import { connection } from "../config/db.config";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

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

export const create = (sellerId: number, store: any) => {};

export const get = (sellerId: number) => {};

export const update = (sellerId: number, store: any) => {};
