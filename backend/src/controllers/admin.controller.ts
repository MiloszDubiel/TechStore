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
  updateProductService,
  deleteProductImagesService,
  addProductImagesService,
  getSellerByUserId,
  updateSellerProfileAdmin,
  getAdminOrdersService,
  getAdminOrderDetailsService,
  updateAdminOrderStatusService,
} from "../services/admin.services";
import { getCurrtentProdcutByID } from "../services/prodcuts.service";
import fs from "fs";
import path from "path";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.json(users);
  } catch (error) {
    console.log(error);
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

export const updateAdminProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const product = await getCurrtentProdcutByID(String(productId));

    if (!product) {
      return res.status(404).json({
        message: "Produkt nie istnieje",
      });
    }

    const sellerId = product.seller_id;

    const removedImages = req.body.removedImages
      ? JSON.parse(req.body.removedImages)
      : [];

    await updateProductService(productId, {
      name: req.body.name,

      description: req.body.description,

      price: Number(req.body.price),

      stock: Number(req.body.stock),

      brand: req.body.brand,

      model: req.body.model,

      category_id: Number(req.body.category_id),

      subcategory_id: Number(req.body.subcategory_id),

      attributes:
        typeof req.body.attributes === "string"
          ? JSON.parse(req.body.attributes)
          : req.body.attributes,
    });

    await deleteProductImagesService(productId, removedImages);

    const files = req.files as Express.Multer.File[];

    if (files?.length) {
      await addProductImagesService(productId, sellerId, files);
    }

    res.json({
      message: "Produkt zaktualizowany",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd aktualizacji produktu",
    });
  }
};
export const updateSellerByAdmin = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const seller = await getSellerByUserId(userId);

    if (!seller) {
      return res.status(404).json({
        message: "Ten użytkownik nie posiada sklepu",
      });
    }

    const oldLogo = seller.logo ? path.basename(seller.logo) : null;

    if (req.file && oldLogo) {
      const oldPath = path.join(
        process.cwd(),
        "uploads",
        "sellers",
        String(userId),
        oldLogo,
      );

      await fs.promises.unlink(oldPath).catch(() => {});
    }

    const newLogo = req.file ? req.file.filename : oldLogo;

    await updateSellerProfileAdmin(userId, {
      ...req.body,
      logo: newLogo,
    });

    res.json({
      message: "Sklep został zaktualizowany",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd aktualizacji sklepu",
    });
  }
};
export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getAdminOrdersService();

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Wystąpił błąd podczas pobierania zamówień.",
    });
  }
};
export const getAdminOrderDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(200).json({ message: "Brak id" });
    }

    const orders = await getAdminOrderDetailsService(id as string);

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Wystąpił błąd podczas pobierania zamówień.",
    });
  }
};

export const updateAdminOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);

    const { status } = req.body;

    console.log(status);

    await updateAdminOrderStatusService(orderId, status);

    res.json({
      message: "Status zamówienia zmieniony",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd aktualizacji statusu",
    });
  }
};
