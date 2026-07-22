import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2/promise";
import { connection } from "../config/db.config";

type User = {
  id: number;
  email: string;
  name: string;
  last_name: string;
  role: string;
  password: string;
  phone: string;
};



export const registerUser = async (data: any) => {
  const { email, password, name, last_name, role } = data;

  const [existing] = await connection.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ?",
    [email],
  );

  if (existing.length > 0) {
    throw new Error("Użytkownik już istnieje");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await connection.query(
    `
      INSERT INTO users
      (
        email,
        password,
        name,
        last_name,
        role
      )
      VALUES (?, ?, ?, ?, ?)
      `,
    [email, hashedPassword, name, last_name, "USER"],
  );

  return {
    message: "Rejestracja zakończona sukcesem",
  };
};

export const loginUser = async (email: string, password: string) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT
      id,
      email,
      name,
      last_name,
      role,
      password,
      phone
    FROM users
    WHERE email = ?
    `,
    [email],
  );

  if (rows.length === 0) {
    throw new Error("Nieprawidłowy email lub hasło");
  }

  const user = rows[0] as User;

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Nieprawidłowy email lub hasło");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      lastName: user.last_name,
      phone: user.phone,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES),
    },
  );

  const refreshToken = uuidv4();

  await connection.query(
    `
    INSERT INTO refresh_tokens
    (
      user_id,
      token,
      expires_at
    )
    VALUES
    (
      ?,
      ?,
      DATE_ADD(
        NOW(),
        INTERVAL ? SECOND
      )
    )
    `,
    [user.id, refreshToken, process.env.REFRESH_TOKEN_EXPIRES],
  );

  return {
    accessToken,
    refreshToken,
    id: user.id,
  };
};

export const getUserById = async (id: number) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT
      id,
      email,
      name,
      last_name,
      role,
      phone
    FROM users
    WHERE id = ?
    `,
    [id],
  );

  if (rows.length === 0) {
    throw new Error("Użytkownik nie znaleziony");
  }

  return rows[0];
};

export const logoutUser = async (refreshToken: string) => {
  await connection.query(
    `
    UPDATE refresh_tokens
    SET is_revoked = TRUE
    WHERE token = ?
    `,
    [refreshToken],
  );

  return {
    message: "Wylogowano",
  };
};

export const refreshUserToken = async (refreshToken: string) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT 
      refresh_tokens.id,
      user_id,
      token,
      email,
      role,
      expires_at
    FROM refresh_tokens
    INNER JOIN users 
      ON users.id = refresh_tokens.user_id
    WHERE token = ?
      AND is_revoked = FALSE
    `,
    [refreshToken],
  );

  if (rows.length === 0) {
    throw new Error("Nieprawidłowy refresh token");
  }

  const tokenData = rows[0] as any;

  if (new Date(tokenData.expires_at) < new Date()) {
    throw new Error("Refresh token wygasł");
  }

  const accessExpires = Number(process.env.ACCESS_TOKEN_EXPIRES);

  const accessToken = jwt.sign(
    {
      id: tokenData.user_id,
      email: tokenData.email,
      role: tokenData.role,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: accessExpires,
    },
  );

  return {
    accessToken,
  };
};
