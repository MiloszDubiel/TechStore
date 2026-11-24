import { supabaseAdmin } from "../lib/supabaseAdmin";
import path from "node:path";
import slugify from "slugify";
import { createNotificationService } from "./notification.service";
import { prisma } from "../lib/prisma";

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  model: string;

  categoryId: number;
  subcategoryId?: number;

  attributes: {
    name: string;
    value: string;
  }[];
}

export const getSellerByUserId = async (userId: number) => {
  const seller = await prisma.sellerProfile.findFirst({
    where: {
      userId,
    },
  });

  return seller ?? null;
};

export const getCompanyInfo = async (userId: number) => {
  const company = await prisma.sellerProfile.findFirst({
    where: {
      userId,
    },
  });

  return company ?? null;
};

export const createSellerProfile = async ({
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
}: {
  userId: number;
  shopName: string;
  slug: string;
  description: string;
  logo: string | null;
  nip: string | null;
  city?: string;
  postalCode?: string;
  street?: string;
  companyName: string;
  uploadPath: string;
}) => {
  const result = await prisma.sellerProfile.create({
    data: {
      userId,
      shopName: shopName,
      slug,
      description,
      logo,
      nip,
      city: city || null,
      postalCode: postalCode || null,
      street: street || null,
      companyName: companyName,
      path: uploadPath,
    },
    select: {
      id: true,
    },
  });

  return result.id;
};

export const updateUserRoleToSeller = async (userId: number) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "SELLER",
    },
  });
};

export const getSellerProductsByID = async (
  sellerId: number,
  productId: number,
) => {
  console.log(productId);

  const product = await prisma.product.findFirst({
    where: {
      sellerId,
      id: productId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      attributes: true,
      createdAt: true,
      brand: true,
      model: true,
      isDeleted: true,
      isVisible: true,
      productData: true,

      category: {
        select: {
          id: true,
        },
      },

      subcategory: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("Nie jestes włascicielem produktu");
  }

  const { category, subcategory, ...productData } = product;

  return {
    product: {
      ...productData,
      categoryId: category?.id ?? null,
      subcategoryId: subcategory?.id ?? null,
    },
  };
};
export const getSellerProducts = async (
  sellerId: number,
  page: number,
  limit: number,
  search: string = "",
) => {
  const offset = (page - 1) * limit;

  const where = {
    sellerId,
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              price: {
                equals: Number(search),
              },
            },
          ],
        }
      : {}),
  };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({
      where: {
        sellerId,
      },
    }),

    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        attributes: true,
        createdAt: true,
        brand: true,
        model: true,
        isDeleted: true,
        isVisible: true,
        productData: true,

        category: {
          select: {
            id: true,
          },
        },

        subcategory: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    }),
  ]);

  return {
    products: products.map(({ category, subcategory, ...product }) => ({
      ...product,
      categoryId: category?.id ?? null,
      subcategoryId: subcategory?.id ?? null,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// export const saveProductImages = async (productId: number, files: any) => {
//   if (files.length === 0) return;

//   return await prisma.productImage.createMany({
//     data: files.map((file: any) => ({
//       productId,
//       image: file.filename,
//     })),
//   });
// };

export const deleteProductFromDB = async (
  productId: number,
  sellerId: number,
) => {
  return await prisma.product.updateMany({
    where: {
      id: productId,
      sellerId,
    },
    data: {
      isDeleted: true,
      isVisible: false,
    },
  });
};
export const editSellerProfile = async (data: {
  userId: number;
  shopName: string;
  slug: string;
  description: string;
  logo: string | null;
  nip: string | null;
  city?: string;
  postalCode?: string;
  street?: string;
  companyName: string;
  uploadPath: string;
}) => {
  try {
    const slug = slugify(
      data.shopName + " " + data.companyName + " " + data.userId,
      {
        lower: true,
        strict: true,
        trim: true,
      },
    );

    const result = await prisma.sellerProfile.updateMany({
      where: {
        userId: data.userId,
      },
      data: {
        shopName: data.shopName,
        slug,
        description: data.description,
        logo: data.logo,
        nip: data.nip,
        city: data.city || null,
        postalCode: data.postalCode || null,
        street: data.street || null,
        companyName: data.companyName,
        path: data.uploadPath,
      },
    });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSellerById = async (id: number, slug: string) => {
  const seller = await prisma.sellerProfile.findFirst({
    where: {
      userId: id,
      slug,
    },
    include: {
      user: {
        select: {
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              brand: true,
              model: true,
              productData: true,
            },
          },
        },
      },
    },
  });

  if (!seller) {
    return null;
  }

  const { user, ...sellerData } = seller;

  return {
    seller_id: sellerData.userId,
    shop_name: sellerData.shopName,
    slug: sellerData.slug,
    description: sellerData.description,
    logo: sellerData.logo,
    company_name: sellerData.companyName,
    is_verified: sellerData.isVerified,
    created_at: sellerData.createdAt,

    products: user.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      brand: product.brand,
      model: product.model,
      images: product.productData,
    })),
  };
};

export const createProduct = async (
  sellerId: number,
  data: CreateProductDTO,
  slug: string,
) => {
  const {
    name,
    brand,
    model,
    description,
    price,
    stock,
    categoryId,
    subcategoryId,
    attributes,
  } = data;

  const product = await prisma.product.create({
    data: {
      sellerId,
      name,
      description,
      price,
      stock,
      categoryId: Number(categoryId),
      subcategoryId: Number(subcategoryId) ?? null,
      attributes,
      brand,
      model,
      slug,
      isVisible: true,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  return {
    id: product.id,
    name,
    description,
    price,
    stock,
    categoryId,
    subcategoryId,
    brand,
    model,
    attributes,
  };
};

export const updateProductService = async (data: any) => {
  const {
    id,
    sellerId,
    name,
    description,
    price,
    stock,
    brand,
    model,
    categoryId,
    subcategoryId,
    attributes,
    product_data,
  } = data;

  const result = await prisma.product.updateMany({
    where: {
      id: Number(id),
      sellerId: Number(sellerId),
    },
    data: {
      name,
      description,
      price,
      stock,
      brand,
      model,
      categoryId: categoryId,
      subcategoryId: subcategoryId ?? null,
      attributes,
      productData: product_data,
      updatedAt: new Date(),
    },
  });

  return result;
};

export const updateProductImages = async (
  productId: number,
  sellerId: number,
  files: Express.Multer.File[],
) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      sellerId,
    },
    select: {
      id: true,
      productData: true,
    },
  });

  if (!product) {
    throw new Error("Produkt nie istnieje");
  }

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

  const productData = (product.productData as Record<string, any>) ?? {};

  const oldImages = Array.isArray(productData.url) ? productData.url : [];

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      productData: {
        ...productData,
        url: [...oldImages, ...uploadedImages],
      },
    },
  });

  return uploadedImages;
};

// export const deleteProductImagesService = async (
//   productId: number,
//   sellerId: number,
//   images: string[],
// ) => {
//   if (!images.length) return;

//   await prisma.productImage.deleteMany({
//     where: {
//       productId,
//       image: {
//         in: images,
//       },
//       product: {
//         sellerId,
//       },
//     },
//   });
// };

export const getSellerByUserIdService = async (userId: number) => {
  const seller = await prisma.sellerProfile.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      shopName: true,
      description: true,
      companyName: true,
      nip: true,
      street: true,
      city: true,
      postalCode: true,
      logo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return seller
    ? {
        ...seller,
        user_id: seller.userId,
        shop_name: seller.shopName,
        company_name: seller.companyName,
        postal_code: seller.postalCode,
        created_at: seller.createdAt,
        updated_at: seller.updatedAt,
      }
    : null;
};
export const getSellerOverviewService = async (sellerId: number) => {
  const [revenue, orders, products, customers, lastOrders] = await Promise.all([
    prisma.$queryRaw<{ revenue: number }[]>`
        SELECT COALESCE(SUM(o.total_price), 0) AS revenue
        FROM orders o
        WHERE o.status = 'COMPLETED'
          AND EXISTS (
            SELECT 1
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = o.id
              AND p.seller_id = ${sellerId}
          )
      `,

    prisma.$queryRaw<{ orders: number }[]>`
        SELECT COUNT(DISTINCT o.id)::int AS orders
        FROM orders o
        WHERE EXISTS (
          SELECT 1
          FROM order_items oi
          JOIN products p ON p.id = oi.product_id
          WHERE oi.order_id = o.id
            AND p.seller_id = ${sellerId}
        )
      `,

    prisma.product.count({
      where: {
        sellerId,
      },
    }),

    prisma.$queryRaw<{ customers: number }[]>`
        SELECT COUNT(DISTINCT o.user_id)::int AS customers
        FROM orders o
        WHERE EXISTS (
          SELECT 1
          FROM order_items oi
          JOIN products p ON p.id = oi.product_id
          WHERE oi.order_id = o.id
            AND p.seller_id = ${sellerId}
        )
      `,

    prisma.$queryRaw`
        SELECT
          o.id,
          o.order_number,
          o.total_price,
          o.status,
          o.created_at,
          CONCAT(o.customer_name, ' ', o.customer_last_name) AS customer
        FROM orders o
        WHERE EXISTS (
          SELECT 1
          FROM order_items oi
          JOIN products p ON p.id = oi.product_id
          WHERE oi.order_id = o.id
            AND p.seller_id = ${sellerId}
        )
        ORDER BY o.created_at DESC
        LIMIT 4
      `,
  ]);

  return {
    revenue: revenue[0]?.revenue ?? 0,
    orders: orders[0]?.orders ?? 0,
    products,
    customers: customers[0]?.customers ?? 0,
    lastOrders,
  };
};
export const getSellerOrdersService = async (
  sellerId: number,
  page: number,
  limit: number,
  search: string = "",
) => {
  const offset = (page - 1) * limit;

  const [count, orders] = await Promise.all([
    // Liczba zamówień
    prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM orders o
      WHERE EXISTS (
        SELECT 1
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = o.id
          AND p.seller_id = ${sellerId}
      )
    `,

    // Lista zamówień
    prisma.$queryRaw`
      SELECT
        o.id,
        o.order_number,
        o.status,
        o.total_price,
        o.delivery_method,
        o.created_at,
        o.customer_name,
        o.customer_last_name,
        o.email,
        u.email AS user_email,
        u.name AS user_name,
        u.last_name AS user_last_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE EXISTS (
        SELECT 1
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = o.id
          AND p.seller_id = ${sellerId}
      )
      ORDER BY o.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `,
  ]);

  const total = count[0]?.total ?? 0;

  return {
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
export const getSellerOrderDetailsService = async (
  orderId: number,
  sellerId: number,
) => {
  const rows = await prisma.$queryRaw<any[]>`
    SELECT
      -- ZAMÓWIENIE
      o.id,
      o.order_number,
      o.status,
      o.total_price,
      o.delivery_method,
      o.delivery_price,
      o.payment_method,
      o.created_at,

      -- DOSTAWA
      o.locker_id,
      o.locker_name,
      o.locker_address,

      -- KLIENT
      o.customer_name,
      o.customer_last_name,
      o.customer_phone,
      o.user_id,
      o.email,
      u.name,
      u.last_name,

      -- ADRES
      o.customer_street,
      o.customer_postal_code,
      o.customer_city,
      o.customer_country,

      -- PRODUKT
      oi.id AS item_id,
      oi.product_name,
      oi.quantity,
      oi.price,
      oi.image,

      -- ZDJĘCIA
      (
        SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', pi.id,
            'image', pi.image,
            'url', pi.url,
            'is_main', pi.is_main
          )
          ORDER BY pi.id
        )
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS images

    FROM orders o

    JOIN order_items oi
      ON oi.order_id = o.id

    JOIN products p
      ON p.id = oi.product_id

    LEFT JOIN users u
      ON u.id = o.user_id

    WHERE o.id = ${orderId}
      AND p.seller_id = ${sellerId}

    ORDER BY oi.id ASC
  `;

  if (!rows.length) {
    return null;
  }

  const order = rows[0];

  return {
    id: order.id,
    order_number: order.order_number,
    status: order.status,

    total_price: order.total_price,

    delivery: {
      method: order.delivery_method,
      price: order.delivery_price,

      locker: order.locker_id
        ? {
            id: order.locker_id,
            name: order.locker_name,
            address: order.locker_address,
          }
        : null,
    },

    payment_method: order.payment_method,

    customer: {
      first_name: order.name || order.customer_name,
      last_name: order.last_name || order.customer_last_name,
      phone: order.customer_phone,
      email: order.email,
      user_id: order.user_id,

      address: {
        street: order.customer_street,
        postal_code: order.customer_postal_code,
        city: order.customer_city,
        country: order.customer_country,
      },
    },

    items: rows.map((item) => ({
      id: item.item_id,
      name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      images: item.images ?? [],
    })),

    created_at: order.created_at,
  };
};
export const updateSellerOrderStatusService = async (
  orderId: number,
  sellerId: number,
  status: string,
) => {
  const affectedRows = await prisma.$executeRaw`
    UPDATE orders o
    SET status = ${status}
    WHERE o.id = ${orderId}
      AND EXISTS (
        SELECT 1
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = o.id
          AND p.seller_id = ${sellerId}
      )
  `;

  if (!affectedRows) {
    return false;
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      userId: true,
      orderNumber: true,
    },
  });

  if (!order?.userId) {
    return true;
  }

  const messages: Record<string, string> = {
    NEW: "Otrzymaliśmy Twoje zamówienie",
    PROCESSING: "Twoje zamówienie jest przygotowywane",
    SHIPPED: "Twoja przesyłka została wysłana",
    COMPLETED: "Twoje zamówienie zostało dostarczone",
    CANCELLED: "Twoje zamówienie zostało anulowane",
  };

  await createNotificationService({
    userId: order.userId,
    type: "ORDER_STATUS",
    title: "Zmiana statusu zamówienia",
    message: messages[status] ?? "Status zamówienia został zmieniony",
  });

  return true;
};
export const getSubcategoryParameters = async (id: number) => {
  const rows = await prisma.$queryRaw`
    SELECT
      sp.id,
      sp.name,
      sp.label,
      sp.type,
      sp.required,

      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', po.id,
            'value', po.value
          )
        ) FILTER (WHERE po.id IS NOT NULL),
        '[]'::json
      ) AS options

    FROM subcategory_parameters sp

    LEFT JOIN parameter_options po
      ON po.parameter_id = sp.id

    WHERE sp.subcategory_id = ${id || 0}

    GROUP BY
      sp.id,
      sp.name,
      sp.label,
      sp.type,
      sp.required

    ORDER BY sp.id
  `;

  return rows;
};
