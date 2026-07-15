import { Request, Response } from "express";
import slugify from "slugify";
import {
  createSellerProfile,
  getSellerByUserId,
  updateUserRoleToSeller,
  getSellerProducts,
  createProduct,
  saveProductImages,
  deleteProductFromDB,
} from "../services/seller.services";

export const createSeller = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { shop_name, description, nip } = req.body;

    if (!shop_name || !description) {
      return res.status(400).json({
        message: "Uzupełnij wymagane pola.",
      });
    }

    const exists = await getSellerByUserId(userId);

    if (exists) {
      return res.status(400).json({
        message: "Posiadasz już konto sprzedawcy.",
      });
    }

    const slug = slugify(shop_name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const logo = req.file?.filename ?? null;

    await createSellerProfile({
      userId,
      shop_name,
      slug,
      description,
      logo,
      nip,
    });

    await updateUserRoleToSeller(userId);

    res.status(201).json({
      success: true,
      message: "Konto sprzedawcy zostało utworzone.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Wystąpił błąd serwera.",
    });
  }
};
export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { shop_name, description, nip } = req.body;

    if (!shop_name || !description) {
      return res.status(400).json({
        message: "Uzupełnij wymagane pola.",
      });
    }

    const exists = await getSellerByUserId(userId);

    if (exists) {
      return res.status(400).json({
        message: "Posiadasz już konto sprzedawcy.",
      });
    }

    const slug = slugify(shop_name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const logo = req.file?.filename ?? null;

    await createSellerProfile({
      userId,
      shop_name,
      slug,
      description,
      logo,
      nip,
    });

    await updateUserRoleToSeller(userId);

    res.status(201).json({
      success: true,
      message: "Konto sprzedawcy zostało utworzone.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Wystąpił błąd serwera.",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  if (userId != id) {
    return res.status(403).json({
      message: "Brak uprawnien",
      succes: false,
    });
  }

  try {
    const profile = await getSellerByUserId(userId);

    res.status(200).json({
      profile,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Wewnetrzny błąd serwera",
      success: false,
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;

    const products = await getSellerProducts(sellerId);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Nie udało się pobrać ofert",
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;

    if (!sellerId) {
      res.status(404).json({ message: "Brak id" });
    }

    const product = await createProduct(sellerId, req.body);

    if (req.files) {
      await saveProductImages(product.id, req.files as Express.Multer.File[]);
    }

    res.status(201).json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Nie udało się dodać produktu",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;
    const productId = Number(req.params.id);

    const result: any = await deleteProductFromDB(productId, sellerId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Nie znaleziono produktu lub nie należy do Ciebie.",
      });
    }

    return res.status(200).json({
      message: "Produkt został usunięty.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Nie udało się usunąć produktu.",
    });
  }
};
