import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  getUserById,
  logoutUser,
  refreshUserToken,
} from "../services/auth.services";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    const { accessToken, refreshToken, user } = await loginUser(
      email,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800 * 1000,
    });

    res.json({
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.json(null);
    }

    const userData = await getUserById(user.id);

    res.json(userData);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      message: "Wylogowano pomyślnie",
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd wylogowania",
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Brak refresh tokena",
      });
    }

    const { accessToken } = await refreshUserToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 900 * 1000,
    });

    return res.sendStatus(204);
  } catch (error: any) {
    return res.status(401).json({
      message: error.message,
    });
  }
};
