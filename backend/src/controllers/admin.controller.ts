import { Request, Response } from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  unactivUser,
  activeUser,
  getAllAdminProducts,
  hideProduct,
  showProduct,
  deleteProduct,
  updateAdminProduct,
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

export const activeUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await activeUser(Number(id));

    res.json({
      message: "Użytkownik został aktywowany.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas aktywacji użytkownika.",
    });
  }
};

export const getAdminProductsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const products = await getAllAdminProducts();

    res.json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Nie udało się pobrać produktów",
    });
  }
};

export const hideProductController = async (req: Request, res: Response) => {
  try {
    await hideProduct(Number(req.params.id));

    res.json({
      message: "Produkt został ukryty",
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas ukrywania produktu",
    });
  }
};

export const showProductController = async (req: Request, res: Response) => {
  try {
    await showProduct(Number(req.params.id));

    res.json({
      message: "Produkt został pokazany",
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas aktywacji produktu",
    });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    await deleteProduct(Number(req.params.id));

    res.json({
      message: "Produkt został usunięty",
    });
  } catch (error) {
    res.status(500).json({
      message: "Błąd podczas usuwania produktu",
    });
  }
};

export const updateAdminProductController = async (
  req: Request,
  res: Response,
) => {
  try {
    const productId = Number(req.params.id);
    console.log(req.body);

    
    await updateAdminProduct(productId, req.body);

    return res.status(200).json({
      success: true,
      message: "Produkt został zaktualizowany.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Nie udało się zaktualizować produktu.",
    });
  }
};
