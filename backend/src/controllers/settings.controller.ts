import { Request, Response } from "express";
import { updateUserInDB } from "../services/settings.services";

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // z JWT middleware
    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Brak wymaganych danych",
      });
    }

    await updateUserInDB({
      id: userId,
      firstName,
      lastName,
      phone,
    });

    return res.status(200).json({
      success: true,
      message: "Dane zaktualizowane",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Błąd serwera",
    });
  }
};
