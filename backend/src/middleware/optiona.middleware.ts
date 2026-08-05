import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    (req as any).user = decoded;
  } catch (error) {}

  next();
};
