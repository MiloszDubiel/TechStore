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

    if (!email || !password) {
      return res.status(400).json({
        message: "Podaj email oraz hasło",
      });
    }

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await getUserById(userId);

    res.json(user);
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const result = await logoutUser(refreshToken);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Brak refresh tokena",
      });
    }

    const result = await refreshUserToken(refreshToken);

    res.json(result);
  } catch (error: any) {
    res.status(403).json({
      message: error.message,
    });
  }
};
