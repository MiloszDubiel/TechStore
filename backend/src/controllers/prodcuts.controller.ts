import { Request, Response } from "express";
import {
  getProducts,
  getCurrtentProdcut,
  getCurrtentProdcutByID,
  saveOrderToDB,
} from "../services/prodcuts.service";

export const getOffersFromDatabase = async (req: Request, res: Response) => {
  let query = { ...req.query };

  try {
    const offers = await getProducts(query);
    res.json(offers);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Błąd pobierania ofert" });
  }
};

export const orderProdcuts = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const { orderId, success } = await saveOrderToDB(userId, req.body);

  if (success) return res.status(200).json({ orderId, success });

  return res.status(500).json({ success });
};

export const getProductByExternalID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const response = await getCurrtentProdcut(id as string);

    if (!response) {
      return res.status(400).json({ error: "Brak produktu" });
    }

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const response = await getCurrtentProdcutByID(id as string);

    if (!response) {
      return res.status(400).json({ error: "Brak produktu" });
    }

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
