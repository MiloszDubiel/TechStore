import { Request, Response, NextFunction } from "express";
import { type AuthRequest } from "../types/express";
export const verifyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.user);

  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Brak autoryzacji",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Brak uprawnień administratora",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Błąd autoryzacji",
    });
  }
};
