import { prisma } from "../lib/prisma";

export const insertReview = async (
  product_id: string | number,
  rating: string,
  comment: string,
  id: string | number,
) => {
  try {
    const result = await prisma.productReview.create({
      data: {
        productId: Number(product_id),
        userId: Number(id),
        rating: Number(rating),
        comment,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getProductRev = async (productId: string | number) => {
  const reviews = await prisma.productReview.findMany({
    where: {
      productId: Number(productId),
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews.map((review) => ({
    ...review,
    email: review.user.email,
    user: undefined,
  }));
};

export const setComment = async (reviewId: number | string, reply: string) => {
  const result = await prisma.productReview.updateMany({
    where: {
      id: Number(reviewId),
    },
    data: {
      sellerReply: reply,
    },
  });

  return result;
};
