import { Request, Response } from "express";
import {
  deleteAddressFromDB,
  updateUserInDB,
} from "../services/settings.services";
import {
  getAdressesFromDB,
  saveAdressesToDB,
  updateAdressesToDB,
  editPassword,
  getPassword,
  getOrdersFromDB,
  getOrderDetailsFromDB,
} from "../services/settings.services";

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { last_name, name, phone, email } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Brak wymaganych danych",
      });
    }

    await updateUserInDB({
      id: userId,
      name,
      last_name,
      phone,
      email,
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

    const results = (await getAdressesFromDB(id as string)) as any[];

    const addresses = results.map((address: any) => ({
      ...address,
      is_default: Boolean(address.is_default),
    }));

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
    const { street, postal_code, city, is_default } = req.body;
    const { id } = (req as any).user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brak id",
      });
    }

    const result = await saveAdressesToDB(
      id,
      street,
      postal_code,
      city,
      is_default,
    );

    if (typeof result === "string") {
      return res.status(400).json({
        message: result,
      });
    }

    const newAddress = {
      id: result.insertId,
      street,
      postal_code,
      city,
      is_default,
    };

    return res.status(201).json({
      address: newAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Błąd serwera",
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

export const editUserSecurity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const result = await editPassword({
      userId,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    return res.status(200).json({
      message: "Hasło zostało pomyślnie zmienione",
      result,
    });
  } catch (error: any) {
    switch (error.message) {
      case "Użytkownik nie znaleziony":
        return res.status(404).json({
          message: error.message,
        });

      case "Aktualne hasło jest niepoprawne":
        return res.status(401).json({
          message: error.message,
        });

      case "Hasła nie są takie same":
        return res.status(400).json({
          message: error.message,
        });

      default:
        return res.status(500).json({
          message: "Wewnętrzny błąd serwera",
        });
    }
  }
};

export const getPasswordUpdatedAt = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await getPassword(userId);

    return res.status(200).json({
      message: "Data ostatniej zmiany hasła",
      result: result.passwordUpdatedAt,
    });
  } catch (error: any) {
    switch (error.message) {
      case "Użytkownik nie znaleziony":
        return res.status(404).json({
          message: error.message,
        });

      case "Aktualne hasło jest niepoprawne":
        return res.status(401).json({
          message: error.message,
        });

      case "Hasła nie są takie same":
        return res.status(400).json({
          message: error.message,
        });

      default:
        return res.status(500).json({
          message: "Wewnętrzny błąd serwera",
        });
    }
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const orders = await getOrdersFromDB(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Błąd pobierania zamówień",
    });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Brak ID",
      });
    }

    const order = await getOrderDetailsFromDB(id as string, userId);

    res.status(200).json({
      order,
      message: "Pobrano zamówienia ",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Błąd pobierania zamówienia",
    });
  }
};
