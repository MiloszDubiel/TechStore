import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

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
  const { email, password, name, last_name } = data;

  const existing = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error("Użytkownik już istnieje");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      lastName: last_name,
      role: "USER",
    },
  });

  return {
    message: "Rejestracja zakończona sukcesem",
  };
};
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
      password: true,
      phone: true,
    },
  });

  if (!user) {
    throw new Error("Nieprawidłowy email lub hasło");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Nieprawidłowy email lub hasło");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES),
    },
  );

const refreshToken = randomUUID();

  const expiresAt = new Date(
    Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRES) * 1000,
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      last_name: user.lastName,
      role: user.role,
      email: user.email,
    },
  };
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
      phone: true,
    },
  });

  if (!user) {
    throw new Error("Użytkownik nie znaleziony");
  }

  return {
    ...user,
    last_name: user.lastName,
  };
};

export const logoutUser = async (refreshToken: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      token: refreshToken,
    },
    data: {
      isRevoked: true,
    },
  });

  return {
    message: "Wylogowano",
  };
};

export const refreshUserToken = async (refreshToken: string) => {
  const tokenData = await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
      isRevoked: false,
    },
    select: {
      id: true,
      userId: true,
      token: true,
      expiresAt: true,

      user: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  });

  if (!tokenData) {
    throw new Error("Nieprawidłowy refresh token");
  }

  if (tokenData.expiresAt < new Date()) {
    throw new Error("Refresh token wygasł");
  }

  const accessExpires = Number(process.env.ACCESS_TOKEN_EXPIRES);

  const accessToken = jwt.sign(
    {
      id: tokenData.userId,
      email: tokenData.user.email,
      role: tokenData.user.role,
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
