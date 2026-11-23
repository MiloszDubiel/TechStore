import { prisma } from "../lib/prisma";

const generateOrderNumber = async () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const date = `${year}${month}${day}`;

  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(year, today.getMonth(), today.getDate()),
        lt: new Date(year, today.getMonth(), today.getDate() + 1),
      },
    },
  });

  const nextNumber = count + 1;

  return `MITS-${date}-${String(nextNumber).padStart(5, "0")}`;
};

const componentsCategories = [
  "Procesory",
  "Dyski HDD",
  "Dyski SSD",
  "Pamięć RAM",
  "Karty graficzne",
  "Płyty główne",
  "GPU",
  "CPU",
  "SSD",
  "HDD",
  "RAM",
];

// function mapMainCategory(categoryName: string | null) {
//   if (!categoryName) return null;

//   if (componentsCategories.includes(categoryName)) {
//     return {
//       main: "Podzespoły",
//       sub: categoryName,
//     };
//   }

//   return {
//     main: categoryName,
//     sub: null,
//   };
// }

export const getProducts = async (query: any) => {
  const {
    categories,
    brands,
    min,
    max,
    stock,
    search,
    limit = 10,
    page = 1,
    ...filters
  } = query;

  const currentPage = Number(page);
  const pageSize = Number(limit);
  const offset = (currentPage - 1) * pageSize;

  const where: any = {
    stock: {
      gt: 0,
    },
  };

  if (categories) {
    const cats = categories.split(",");

    where.category = {
      is: {
        name: {
          in: cats,
        },
      },
    };
  }

  if (brands) {
    const brandList = brands.split(",");

    where.brand = {
      in: brandList,
    };
  }

  if (min !== undefined && min !== "") {
    where.price = {
      ...where.price,
      gte: Number(min),
    };
  }

  if (max !== undefined && max !== "") {
    where.price = {
      ...where.price,
      lte: Number(max),
    };
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  Object.entries(filters).forEach(([label, value]) => {
    if (value === undefined || value === "") return;

    where.AND = [
      ...(where.AND || []),
      {
        attributes: {
          path: [label],
          equals: String(value),
        },
      },
    ];
  });

  const [total, products] = await prisma.$transaction([
    prisma.product.count({
      where,
    }),

    prisma.product.findMany({
      where,
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
        images: {
          select: {
            image: true,
            url: true,
          },
        },
        seller: {
          select: {
            sellerProfiles: {
              take: 1,
              select: {
                shopName: true,
                companyName: true,
                logo: true,
                slug: true,
                createdAt: true,
                isVerified: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize,
      skip: offset,
    }),
  ]);

  return {
    products: products.map((product) => {
      const { category, subcategory, seller, images, ...productData } = product;

      const sellerProfile = seller?.sellerProfiles[0];

      return {
        ...productData,

        category_name: category?.name ?? null,
        subcategory_name: subcategory?.name ?? null,

        shop_name: sellerProfile?.shopName ?? null,
        company_name: sellerProfile?.companyName ?? null,
        logo: sellerProfile?.logo ?? null,
        slug: sellerProfile?.slug ?? null,
        seller_created_at: sellerProfile?.createdAt ?? null,
        is_verified: sellerProfile?.isVerified ?? null,

        images,
      };
    }),

    page: currentPage,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getCurrtentProdcut = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
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
      images: {
        select: {
          url: true,
        },
      },
      seller: {
        select: {
          sellerProfiles: {
            take: 1,
            select: {
              shopName: true,
              companyName: true,
              logo: true,
              slug: true,
              createdAt: true,
              isVerified: true,
              banner: true,
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  const { category, subcategory, images, seller, ...productData } = product;

  const sellerProfile = seller?.sellerProfiles[0];

  return {
    ...productData,

    category_name: category?.name ?? null,
    subcategory_name: subcategory?.name ?? null,

    shop_name: sellerProfile?.shopName ?? null,
    company_name: sellerProfile?.companyName ?? null,
    logo: sellerProfile?.logo ?? null,
    slug: sellerProfile?.slug ?? null,
    seller_created_at: sellerProfile?.createdAt ?? null,
    is_verified: sellerProfile?.isVerified ?? null,
    banner: sellerProfile?.banner ?? null,

    images: images.map((image) => ({
      url: image.url,
    })),
  };
};

export const getCurrtentProdcutByID = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  return product ?? null;
};

export const saveOrderToDB = async (data: any) => {
  return await prisma.$transaction(async (tx) => {
    const {
      customer,
      address,
      delivery,
      payment,
      products,
      user_id: userId = null,
    } = data;

    console.log(customer, address, delivery, payment, products, userId);

    const normalizedUserId = userId === null ? null : Number(userId);

    const deliveryMethod = delivery.method.toUpperCase();

    const paymentMethod = payment.method.toUpperCase();

    let productsTotal = 0;

    const productsData: any[] = [];

    for (const item of products) {
      const productId = Number(item.id);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Nieprawidłowa ilość produktu");
      }

      const lockedProducts = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT id
        FROM products
        WHERE id = ${productId}
        FOR UPDATE
      `;

      if (!lockedProducts.length) {
        throw new Error("Nie znaleziono produktu");
      }

      const product = await tx.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw new Error("Nie znaleziono produktu");
      }

      if (product.stock < quantity) {
        throw new Error("Jeden z produktów jest już niedostępny");
      }

      if (product.sellerId === normalizedUserId) {
        throw new Error("Nie możesz zamówić produktu ze swojego sklepu");
      }

      productsTotal += Number(product.price) * quantity;

      const productData = product.productData as { image?: string } | null;

      productsData.push({
        id: product.id,
        name: product.name ?? "",
        price: product.price,
        quantity,
        image: productData?.image ?? null,
      });

      const newStock = product.stock - quantity;

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: {
            decrement: quantity,
          },
          ...(newStock <= 0 && {
            isVisible: false,
          }),
        },
      });
    }

    const finalTotal = productsTotal + Number(delivery.price);

    const orderNumber = await generateOrderNumber();

    const order = await tx.order.create({
      data: {
        userId: normalizedUserId,

        customerName: customer.name,
        customerLastName: customer.last_name,
        email: customer.email,
        customerPhone: customer.phone,

        deliveryMethod,
        deliveryPrice: Number(delivery.price),

        paymentMethod: paymentMethod,

        lockerId: deliveryMethod === "LOCKER" ? delivery.locker?.id : null,

        lockerName: deliveryMethod === "LOCKER" ? delivery.locker?.name : null,

        lockerAddress:
          deliveryMethod === "LOCKER" ? delivery.locker?.address : null,

        totalPrice: finalTotal,
        orderNumber,

        customerStreet: address?.street ?? null,
        customerPostalCode: address?.postal_code ?? null,
        customerCity: address?.city ?? null,
        customerCountry: address?.country ?? null,

        status: "NEW",

        items: {
          create: productsData.map((product) => ({
            productId: product.id,
            productName: product.name,
            quantity: product.quantity,
            price: product.price,
            image: product.image,
          })),
        },
      },
    });

    return {
      orderId: order.id,
      orderNumber,
      total: finalTotal,
      success: true,
    };
  });
};

export const getCategoriesFromDB = async () => {
  return await prisma.category.findMany();
};
export const getSubcategoriesFromDB = async () => {
  return await prisma.subcategory.findMany();
};
type FilterResult = {
  label: string;
  value: string;
  count: number;
};

export const getFiltersService = async (
  categoryId?: number,
): Promise<FilterResult[]> => {
  return await prisma.$queryRaw<FilterResult[]>`
    SELECT
      attr->>'label' AS label,
      attr->>'value' AS value,
      COUNT(*)::int AS count
    FROM products p
    CROSS JOIN LATERAL jsonb_array_elements(p.attributes) AS attr
    ${
      categoryId !== undefined
        ? prisma.$queryRaw`WHERE p.category_id = ${categoryId}`
        : prisma.$queryRaw``
    }
    GROUP BY
      attr->>'label',
      attr->>'value'
    ORDER BY
      attr->>'label',
      count DESC
  `;
};
