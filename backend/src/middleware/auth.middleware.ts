import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express";
import { JwtUserPayload } from "../types/jwt";

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Brak tokena",
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token wygasł",
    });
  }
};


