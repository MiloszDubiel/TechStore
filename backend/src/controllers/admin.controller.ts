import { Request, Response } from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  unactivUser,
} from "../services/admin.services";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Błąd pobierania użytkowników",
    });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteUser(Number(id));

    res.json({
      message: "Usunięto użytkownika",
    });
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się usunąć",
    });
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await updateUser(Number(id), req.body);

    res.json({
      message: "Zaktualizowano użytkownika",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Błąd aktualizacji",
    });
  }
};

export const delUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteUser(Number(id));

    res.json({
      message: "Zaktualizowano użytkownika",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Błąd aktualizacji",
    });
  }
};

export const unactiveUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await unactivUser(Number(id));

    res.json({
      message: "Wyłączono konto użytkownika",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Błąd aktualizacji",
    });
  }
};
