import { connection } from "../config/db.config";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

interface UpdateUserData {
  id: number;
  name: string;
  last_name: string;
  phone?: string;
  email: string;
}
interface EditPasswordProps {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const updateUserInDB = async (data: UpdateUserData) => {
  const { id, name, last_name, phone, email } = data;

  return await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      lastName: last_name,
      phone: phone || null,
      email,
    },
  });
};

export const getAdressesFromDB = async (id: string) => {
  return await prisma.address.findMany({
    where: {
      userId: Number(id),
    },
  });
};
export const saveAdressesToDB = async (
  id: string,
  street: string,
  postalCode: string,
  city: string,
  isDefault: boolean,
) => {
  return await prisma.$transaction(async (tx) => {
    const userId = Number(id);

    const addressesCount = await tx.address.count({
      where: {
        userId,
      },
    });

    if (addressesCount > 4) {
      return "Osiągnięto maksymalną liczbe adresów";
    }

    if (isDefault) {
      await tx.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const result = await tx.address.create({
      data: {
        userId,
        street,
        postalCode: postalCode,
        city,
        isDefault: isDefault,
      },
    });

    return result;
  });
};

export const updateAdressesToDB = async (
  id: string,
  street: string,
  postalCode: string,
  city: string,
  isDefault: boolean,
  aid: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const userId = Number(id);
    const addressId = Number(aid);

    if (isDefault) {
      await tx.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return await tx.address.updateMany({
      where: {
        userId,
        id: addressId,
      },
      data: {
        street,
        postalCode,
        city,
        isDefault: isDefault,
      },
    });
  });
};

export const deleteAddressFromDB = async (aid: string) => {
  return await prisma.address.deleteMany({
    where: {
      id: Number(aid),
    },
  });
};
export const editPassword = async ({
  userId,
  currentPassword,
  newPassword,
  confirmPassword,
}: EditPasswordProps) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Hasła nie są takie same");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("Użytkownik nie znaleziony");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Aktualne hasło jest niepoprawne");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        password: hashedPassword,
        passwordUpdatedAt: new Date().toISOString(),
      },
      select: {
        passwordUpdatedAt: true,
      },
    });

    await tx.refreshToken.updateMany({
      where: {
        userId: Number(userId),
      },
      data: {
        isRevoked: true,
      },
    });

    return updated;
  });

  return {
    success: true,
    message: "Hasło zostało zmienione. Zaloguj się ponownie.",
    passwordUpdatedAt: updatedUser.passwordUpdatedAt,
  };
};

export const getPassword = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        passwordUpdatedAt: true,
      },
    });

    if (!user) {
      throw new Error("Użytkownik nie znaleziony");
    }

    return {
      passwordUpdatedAt: user.passwordUpdatedAt,
    };
  } catch (error) {
    throw new Error("Wewnętrzny błąd serwera");
  }
};

export const getOrdersFromDB = async (userId: string | null) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId !== null ? Number(userId) : null,
      },
      select: {
        id: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        orderNumber: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      orders: orders.map(({ _count, ...order }) => ({
        ...order,
        items_count: _count.items,
      })),
      message: "Pobrano zamówienia",
    };
  } catch (err) {
    console.log(err);

    return {
      message: "Błąd pobierania zamówień",
    };
  }
};

export const getOrderDetailsFromDB = async (
  orderId: string,
  userId: number,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return null;
  }

  const productIds = order.items
    .map((item) => item.productId)
    .filter((id): id is number => id !== null);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      subcategory: {
        select: {
          name: true,
        },
      },
      seller: {
        select: {
          id: true,
          sellerProfiles: {
            take: 1,
            select: {
              shopName: true,
              companyName: true,
              logo: true,
              slug: true,
              isVerified: true,
            },
          },
        },
      },
    },
  });

  const productsMap = new Map(products.map((product) => [product.id, product]));

  const items = order.items.map((item) => {
    const product = item.productId ? productsMap.get(item.productId) : null;

    const sellerProfile = product?.seller?.sellerProfiles[0];

    return {
      quantity: item.quantity,
      price: item.price,
      image: (product?.productData as any).ulr,

      product: {
        id: product?.id ?? null,
        name: product?.name ?? item.productName,
        description: product?.description ?? null,
        brand: product?.brand ?? null,
        model: product?.model ?? null,
        attributes: product?.attributes ?? null,
        sellerId: product?.sellerId,

        category_name: product?.category?.name ?? null,
        subcategoryName: product?.subcategory?.name ?? null,

        images: (product as any)?.productData.url ?? [],
      },

      seller: {
        sellerId: product?.seller?.id ?? null,
        shopName: sellerProfile?.shopName ?? null,
        companyName: sellerProfile?.companyName ?? null,
        logo: sellerProfile?.logo ?? null,
        slug: sellerProfile?.slug ?? null,
        isVerified: sellerProfile?.isVerified ?? null,
      },
    };
  });

  return {
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      sellerId: order,

      customer: {
        firstName: order.customerName,
        lastName: order.customerLastName,
        email: order.email,
        phone: order.customerPhone,
      },
      

      delivery: {
        method: order.deliveryMethod,
        price: order.deliveryPrice,

        locker: order.lockerId
          ? {
              id: order.lockerId,
              name: order.lockerName,
              address: order.lockerAddress,
            }
          : null,
      },

      paymentMethod: order.paymentMethod,

    },

    items,
  };
};
