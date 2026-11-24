import { Request, Response } from "express";
import slugify from "slugify";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import {
  createSellerProfile,
  getSellerByUserId,
  updateUserRoleToSeller,
  getSellerProducts,
  createProduct as createProductService,
  updateProductImages,
  deleteProductFromDB,
  editSellerProfile,
  getSellerById,
  updateProductService,
  // deleteProductImagesService,
  getSellerByUserIdService,
  getSellerOverviewService,
  getSellerOrderDetailsService,
  getSellerOrdersService,
  updateSellerOrderStatusService,
  getSubcategoryParameters,
  getSellerProductsByID,
} from "../services/seller.services";

import { getCurrtentProdcutByID } from "../services/prodcuts.service";
import path from "node:path";
import fs from "fs";

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ message: "Brak Id" });
    }

    const {
      shopName,
      description,
      nip,
      companyName,
      street,
      city,
      postalCode,
    } = req.body;

    const file: any = req.file;

    if (!shopName || !description) {
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

    const slug = slugify(`${shopName} ${companyName ?? ""} ${userId}`, {
      lower: true,
      strict: true,
      trim: true,
    });

    let logo: string | null = null;

    let uploadPath = "";
    if (file) {
      uploadPath = `sellers/${userId}/${Date.now()}-${file.originalname}`;

      const { data, error } = await supabaseAdmin.storage
        .from("techstore")
        .upload(uploadPath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      logo = data.path;
    }

    await createSellerProfile({
      userId,
      shopName,
      slug,
      description,
      logo,
      nip,
      city,
      postalCode,
      street,
      companyName,
      uploadPath,
    });

    await updateUserRoleToSeller(userId);

    return res.status(201).json({
      success: true,
      message: "Konto sprzedawcy zostało utworzone.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Wystąpił błąd serwera.",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");

    const products = await getSellerProducts(sellerId, page, limit, search);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Nie udało się pobrać ofert",
    });
  }
};

export const getProductsByID = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;
    const prodcutId = req.params.id;

    const products = await getSellerProductsByID(
      Number(sellerId),
      Number(prodcutId),
    );

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Nie udało się pobrać ofert",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;

    const slug = slugify(req.body.name + " " + sellerId);

    const product = await createProductService(sellerId, req.body, slug);

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Nie udało się utworzyć produktu",
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
export const editSeller = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const seller = await getSellerByUserId(userId);

    const file = req.file;

    if (!seller) {
      return res.status(404).json({
        message: "Profil sprzedawcy nie istnieje",
      });
    }

    const oldLogo = seller.path;

    let newLogo = oldLogo;
    let uploadPath = "";

    if (req.file) {
      uploadPath = `sellers/${userId}/${Date.now()}-${req.file.originalname}`;

      const { data, error } = await supabaseAdmin.storage
        .from("techstore")
        .upload(uploadPath, file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("techstore").getPublicUrl(data.path);

      newLogo = publicUrl;
    }

    await editSellerProfile({
      userId,
      shopName: req.body.shopName,
      slug: req.body.slug,
      description: req.body.description,
      logo: newLogo,
      nip: req.body.nip,
      city: req.body.city,
      postalCode: req.body.postalCode,
      street: req.body.street,
      companyName: req.body.companyName,
      uploadPath: uploadPath,
    });

    if (req.file && oldLogo && oldLogo !== newLogo) {
      const { error } = await supabaseAdmin.storage
        .from("techstore")
        .remove([oldLogo.substring(oldLogo.indexOf("/sellers") + 1)]);

      if (error) {
        console.error("Nie udało się usunąć starego logo:", error);
      }
    }

    return res.json({
      message: "Profil zaktualizowany",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Błąd aktualizacji",
    });
  }
};

export const getSellerPage = async (req: Request, res: Response) => {
  try {
    const { seller_id, slug } = req.params;
    const seller = await getSellerById(Number(seller_id), slug as string);
    if (!seller) {
      return res.status(404).json({
        message: "Nie znaleziono sprzedawcy",
      });
    }
    res.json(seller);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Błąd pobierania sklepu",
    });
  }
};

export const uploadProductImages = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;
    const productId = Number(req.params.id);

    const files = (req.files as Express.Multer.File[]) ?? [];

    if (!files.length) {
      return res.status(400).json({
        message: "Nie przesłano żadnych zdjęć",
      });
    }

    const images = await updateProductImages(productId, sellerId, files);

    return res.status(201).json({
      message: "Zdjęcia dodane",
      images,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Nie udało się dodać zdjęć",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;
    const productId = Number(req.params.id);

    const files = (req.files as Express.Multer.File[]) ?? [];

    const product = await getCurrtentProdcutByID(String(productId));

    if (!product) {
      return res.status(404).json({
        message: "Produkt nie istnieje",
      });
    }

    const removedImages: string[] = req.body.removedImages;

    const oldImages = (product.productData as any)?.url ?? [];

    console.log(oldImages, removedImages);

    const filteredImages = oldImages.filter(
      (img: any) => !removedImages.includes(img.image),
    );

    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const extension = path.extname(file.originalname);

        const fileName = `${Date.now()}-${index}${extension}`;

        const filePath = `products/${sellerId}/${productId}/${fileName}`;

        const { error } = await supabaseAdmin.storage
          .from("techstore")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          throw error;
        }

        const { data } = supabaseAdmin.storage
          .from("techstore")
          .getPublicUrl(filePath);

        return {
          image: filePath,
          url: data.publicUrl,
        };
      }),
    );

    const finalImages = [...filteredImages, ...uploadedImages];

    const attributes =
      typeof req.body.attributes === "string"
        ? JSON.parse(req.body.attributes)
        : req.body.attributes;

    await updateProductService({
      id: productId,
      sellerId,

      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      brand: req.body.brand,
      model: req.body.model,

      category_id: Number(req.body.category_id),
      subcategory_id: Number(req.body.subcategory_id),

      attributes,

      product_data: {
        ...(product.productData as any),
        url: finalImages,
      },
    });

    if (removedImages.length > 0) {
      const { error } = await supabaseAdmin.storage
        .from("techstore")
        .remove(removedImages);

      if (error) {
        console.error("Błąd usuwania zdjęć z Supabase:", error);
      }
    }


    return res.json({
      message: "Produkt zaktualizowany",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Błąd aktualizacji produktu",
    });
  }
};

export const getSellerData = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const seller = await getSellerByUserIdService(userId);

    if (!seller) {
      return res.status(404).json({
        message: "Sklep nie istnieje",
      });
    }

    res.json(seller);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania sklepu",
    });
  }
};
export const getSellerOverview = async (req: any, res: Response) => {
  try {
    const sellerId = req.user.id;

    const overview = await getSellerOverviewService(sellerId);

    res.json(overview);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Błąd pobierania statystyk",
    });
  }
};
export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");

    const orders = await getSellerOrdersService(sellerId, page, limit, search);

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Błąd pobierania zamówień",
    });
  }
};
export const getSellerOrderDetails = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;

    const orderId = Number(req.params.id);

    const order = await getSellerOrderDetailsService(orderId, sellerId);

    if (!order)
      return res.status(404).json({
        message: "Nie znaleziono zamówienia",
      });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Błąd",
    });
  }
};
export const updateSellerOrderStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;

    const orderId = Number(req.params.id);

    const { status } = req.body;

    const updated = await updateSellerOrderStatusService(
      orderId,
      sellerId,
      status,
    );

    if (!updated)
      return res.status(404).json({
        message: "Nie można zmienić statusu",
      });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Błąd",
    });
  }
};
export const getSubParma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rows = await getSubcategoryParameters(Number(id));

    res.json({
      rows: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Błąd",
    });
  }
};
