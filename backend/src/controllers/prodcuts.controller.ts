import { Request, Response } from "express";
import {
  getProducts,
  getCurrtentProdcut,
  getCurrtentProdcutByID,
  saveOrderToDB,
  getCategoriesFromDB,
  getSubcategoriesFromDB,
} from "../services/prodcuts.service";
import { scrapeMediaMarkt } from "../scrapper/scraper";
import { saveToDatabase } from "../scrapper/saveDataToDatabase";

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

export const scrapeProdcuts = async (req: Request, res: Response) => {
  try {
    const offers = await scrapeMediaMarkt();

    for (const offer of offers) {
      await saveToDatabase(offer);
    }

    res.json({
      message: "Produkty zapisane",
      count: offers.length,
    });
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      message: "Błąd pobierania ofert",
    });
  }
};
export const orderProdcuts = async (req: Request, res: Response) => {
  try {
    const { orderId, success, orderNumber } = await saveOrderToDB(req.body);
    return res.status(200).json({
      orderId,
      success,
      orderNumber,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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

export const getCategories = async (req: Request, res: Response) => {
  try {
    const response = await getCategoriesFromDB();

    if (!response) {
      return res.status(400).json({ error: "Brak kategorii" });
    }

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubcategories = async (req: Request, res: Response) => {
  try {
    const response = await getSubcategoriesFromDB();

    if (!response) {
      return res.status(400).json({ error: "Brak podkategorii" });
    }

    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
