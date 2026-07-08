import { Request, Response } from "express";
import {
  deleteAddressFromDB,
  updateUserInDB,
} from "../services/settings.services";
import {
  getAdressesFromDB,
  saveAdressesToDB,
  updateAdressesToDB,
} from "../services/settings.services";

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

export const getAdresses = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).user; // z JWT middleware;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brak id",
      });
    }

    const addresses = await getAdressesFromDB(id as string);
    res.status(200).json({ addresses });
  } catch (e) {
    console.log(e);
  }
};

export const updateAdresses = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).user;

    const { street, postal_code, city, is_default, aid } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brak id użytkownika",
      });
    }

    if (!aid) {
      return res.status(400).json({
        success: false,
        message: "Brak id adresu",
      });
    }

    const addresses = await updateAdressesToDB(
      id,
      street,
      postal_code,
      city,
      Boolean(is_default),
      aid,
    );

    return res.status(200).json({
      success: true,
      message: "Adres zaktualizowany",
      addresses,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      success: false,
      message: "Błąd serwera",
    });
  }
};

export const setAdresses = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).user;

    const { street, postal_code, city, is_default } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brak id użytkownika",
      });
    }

    const address = await saveAdressesToDB(
      id,
      street,
      postal_code,
      city,
      Boolean(is_default),
    );

    return res.status(201).json({
      success: true,
      message: "Adres dodany",
      address,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      success: false,
      message: "Błąd serwera",
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("ADDRESS ID:", id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brak id adresu",
      });
    }

    const result = await deleteAddressFromDB(id as string);

    return res.status(200).json({
      success: true,
      message: "Adres usunięty",
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Błąd serwera",
    });
  }
};
