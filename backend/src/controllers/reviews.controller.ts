import { Request, Response } from "express";
import {
  insertReview,
  getProductRev,
  setComment,
} from "../services/review.services";
import { AuthRequest } from "../types/express";

export const insertReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { product_id, rating, comment } = req.body;

    const results = await insertReview(
      product_id,
      rating,
      comment,
      req.user!.id,
    );

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Błąd dodawania opinii" });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  const productId = req.params.id;

  const result = await getProductRev(productId as string);

  res.json(result);
};

export const setSellerComment = async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const { reply } = req.body;
  const sellerId = (req as any).user.id;

  const result = await setComment(Number(reviewId), reply, sellerId);

  res.json(result);
};
