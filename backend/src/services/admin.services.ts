import { connection } from "../config/db.config";
import { prisma } from "../lib/prisma";

export const getAllUsers = async (
  page: number,
  limit: number,
  search: string = "",
) => {
  const offset = (page - 1) * limit;

  const where = {
    role: {
      not: "ADMIN" as const,
    },
    ...(search && {
      OR: [
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [total, users] = await prisma.$transaction([
    prisma.user.count({
      where,
    }),

    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        isActive: true,

        sellerProfiles: {
          select: {
            id: true,
            shopName: true,
            slug: true,
            description: true,
            logo: true,
            companyName: true,
            nip: true,
            street: true,
            city: true,
            postalCode: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    }),
  ]);

  return {
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      last_name: user.lastName,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      is_active: user.isActive,
      seller: user.sellerProfiles[0]
        ? {
            seller_id: user.sellerProfiles[0].id,
            shop_name: user.sellerProfiles[0].shopName,
            slug: user.sellerProfiles[0].slug,
            description: user.sellerProfiles[0].description,
            logo: user.sellerProfiles[0].logo,
            company_name: user.sellerProfiles[0].companyName,
            nip: user.sellerProfiles[0].nip,
            street: user.sellerProfiles[0].street,
            city: user.sellerProfiles[0].city,
            postal_code: user.sellerProfiles[0].postalCode,
          }
        : null,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });

  return true;
};

export const updateUser = async (id: number, data: any) => {
  const { name, last_name, email, role } = data;

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      lastName: last_name,
      email,
      role,
      isSuperAdmin: role === "ADMIN",
    },
  });

  return true;
};
export const unactivUser = async (id: number) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return true;
};

export const activeUser = async (id: number) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });

  return true;
};
export const getAllAdminProducts = async (
  page: number,
  limit: number,
  search: string = "",
) => {
  const offset = (page - 1) * limit;

  const where = {
    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      ...(search && !isNaN(Number(search)) ? [{ id: Number(search) }] : []),
    ],
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },

      include: {
        images: true,
        category: {
          select: {
            id: true,
          },
          include: {
            subcategories: true,
          },
        },
        seller: {
          select: {
            sellerProfiles: {
              select: {
                shopName: true,
              },
            },
          },
          include: {
            sellerProfiles: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  const formattedProducts = products.map((product) => ({
    ...product,
    sellerName: product.seller?.name,
    sellerLastName: product.seller?.lastName,
    sellerEmail: product.seller?.email,
    shopName: product.seller?.sellerProfiles[0]?.shopName,
    categoryId: product.category?.id,
    subcategoryId: product.subcategoryId,
    images: product.images,
  }));

  return {
    products: formattedProducts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const hideProduct = async (id: number) => {
  await prisma.product.update({
    where: {
      id,
    },
    data: {
      isVisible: false,
    },
  });

  return true;
};

export const showProduct = async (id: number) => {
  await prisma.product.update({
    where: {
      id,
    },
    data: {
      isVisible: true,
    },
  });

  return true;
};

export const deleteProduct = async (id: number) => {
  await prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      isVisible: false,
    },
  });

  return true;
};

//DO AKTUALIZACJI
export const updateProductImages = async (
  productId: number,
  sellerId: number,
  images: Express.Multer.File[],
) => {
  const [products]: any = await connection.query(
    `
    SELECT id
    FROM products
    WHERE id = ?
    AND seller_id = ?
    `,
    [productId, sellerId],
  );

  if (products.length === 0) {
    throw new Error("Produkt nie istnieje");
  }

  if (!images.length) {
    return [];
  }

  const values = images.map((file, index) => [
    productId,

    file.filename,

    `uploads/products/${sellerId}/${productId}/${file.filename}`,

    index === 0 ? 1 : 0,
  ]);

  await connection.query(
    `
    INSERT INTO product_images
    (
      product_id,
      image,
      url,
      is_main
    )
    VALUES ?
    `,
    [values],
  );

  return values;
};

export const deleteProductImagesService = async (
  productId: number,
  images: string[],
) => {
  if (!images.length) return;

  await prisma.productImage.deleteMany({
    where: {
      productId,
      image: {
        in: images,
      },
    },
  });
};

export const updateProductService = async (productId: number, data: any) => {
  const {
    name,
    description,
    price,
    stock,
    brand,
    model,
    category_id,
    subcategory_id,
    attributes,
  } = data;

  const result = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      description,
      price,
      stock,
      brand,
      model,
      categoryId: category_id,
      subcategoryId: subcategory_id,
      attributes,
      updatedAt: new Date(),
    },
  });

  return result;
};

export const addProductImagesService = async (
  productId: number,
  sellerId: number,
  files: Express.Multer.File[],
) => {
  if (!files.length) return;

  const values = files.map((file, index) => ({
    productId,
    image: file.filename,
    url: `uploads/products/${sellerId}/${productId}/${file.filename}`,
    isMain: index === 0,
  }));

  await prisma.productImage.createMany({
    data: values,
  });

  return values;
};
export const updateSellerProfileAdmin = async (userId: number, data: any) => {
  const {
    shop_name,
    description,
    company_name,
    nip,
    street,
    city,
    postal_code,
    logo,
  } = data;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  const result = await prisma.sellerProfile.updateMany({
    where: {
      userId: user?.id,
    },
    data: {
      shopName: shop_name,
      description,
      companyName: company_name,
      nip,
      street,
      city,
      postalCode: postal_code,
      logo: logo || "",
      updatedAt: new Date(),
    },
  });

  return result;
};

export const getSellerByUserId = async (userId: number) => {
  return await prisma.sellerProfile.findFirst({
    where: {
      userId,
    },
  });
};

export const getAdminOrdersService = async (
  page: number,
  limit: number,
  search: string = "",
) => {
  const offset = (page - 1) * limit;

  const where = {
    OR: [
      {
        orderNumber: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      {
        user: {
          is: {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      },
      {
        user: {
          is: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      },
    ],
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    }),

    prisma.order.count({
      where,
    }),
  ]);

  return {
    orders: orders.map((order) => ({
      id: order.id,
      order_number: order.orderNumber,
      user_id: order.userId,

      email: order.user?.email,
      user_name: order.user?.name,
      user_last_name: order.user?.lastName,

      first_name: order.customerName,
      last_name: order.customerLastName,
      phone: order.customerPhone,
      street: order.customerStreet,
      postal_code: order.customerPostalCode,
      city: order.customerCity,
      country: order.customerCountry,

      payment_method: order.paymentMethod,
      delivery_method: order.deliveryMethod,
      delivery_price: order.deliveryPrice,
      total_price: order.totalPrice,
      status: order.status,
      created_at: order.createdAt,
    })),

    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
export const getAdminOrderDetailsService = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      items: {
        select: {
          id: true,
          productId: true,
          productName: true,
          quantity: true,
          price: true,
          image: true,
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  return {
    order_id: order.id,
    order_number: order.orderNumber,
    status: order.status,
    total_price: order.totalPrice,
    delivery_method: order.deliveryMethod,
    delivery_price: order.deliveryPrice,
    locker_id: order.lockerId,
    locker_name: order.lockerName,
    locker_address: order.lockerAddress,
    payment_method: order.paymentMethod,
    created_at: order.createdAt,

    customer: {
      email: order.email,
      name: order.customerName,
      last_name: order.customerLastName,
      street: order.customerStreet,
      postal_code: order.customerPostalCode,
      city: order.customerCity,
      country: order.customerCountry,
      phone: order.customerPhone,
    },

    items: order.items.map((item) => ({
      id: item.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    })),
  };
};

export const updateAdminOrderStatusService = async (
  orderId: number,
  status: string,
) => {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: status as any,
    },
  });
};
