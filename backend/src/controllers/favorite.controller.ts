import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const toggleFavorite = async (req: Request, res: Response) => {
  const userId = Number(req.body.userId);
  const productId = Number(req.params.productId);

  try {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existing) {
      await prisma.favorite.deleteMany({
        where: {
          userId: userId,
          productId: productId,
        },
      });

      return res.json({ favorite: false });
    }

    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });

    return res.json({ favorite: true });
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getFavorites = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    const rows = favorites.map(({ product }) => ({
      ...product,
      images: (
        product.productData as { url: { url: string; image: string }[] }
      ).url.map((el) => el.url),
    }));

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};
