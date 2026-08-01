import { connection } from "../config/db.config";
import { RowDataPacket } from "mysql2";

const generateOrderNumber = async () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const date = `${year}${month}${day}`;

  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) as count
    FROM orders
    WHERE DATE(created_at) = CURDATE()
    `,
  );

  const nextNumber = Number(rows[0]?.count) + 1;

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

function mapMainCategory(categoryName: string | null) {
  if (!categoryName) return null;

  if (componentsCategories.includes(categoryName)) {
    return {
      main: "Podzespoły",
      sub: categoryName,
    };
  }

  return {
    main: categoryName,
    sub: null,
  };
}
export const getProducts = async (params: any) => {
  const {
    categories,
    brands,
    min,
    max,
    stock,
    search,
    limit = 10,
    page = 1,
  } = params;

  const offset = (page - 1) * limit;

  let where = `
    WHERE p.stock > 0
  `;

  const queryParams: any[] = [];

  if (categories) {
    const cats = categories.split(",");

    where += `
      AND c.name IN (${cats.map(() => "?").join(",")})
    `;

    queryParams.push(...cats);
  }

  if (brands) {
    const b = brands.split(",");

    where += `
      AND p.brand IN (${b.map(() => "?").join(",")})
    `;

    queryParams.push(...b);
  }

  if (min) {
    where += `
      AND p.price >= ?
    `;

    queryParams.push(Number(min));
  }

  if (max) {
    where += `
      AND p.price <= ?
    `;

    queryParams.push(Number(max));
  }

  if (stock === "1") {
    where += `
      AND p.stock > 0
    `;
  }

  if (search) {
    where += `
      AND p.name LIKE ?
    `;

    queryParams.push(`%${search}%`);
  }

  const [[count]]: any = await connection.query(
    `
    SELECT COUNT(DISTINCT p.id) AS total

    FROM products p

    LEFT JOIN categories c
      ON c.id = p.category_id

    ${where}
    `,
    queryParams,
  );

  const productParams = [...queryParams, Number(limit), offset];

  const [rows]: any = await connection.query(
    `
    SELECT
      p.*,

      c.name AS category_name,
      sc.name AS subcategory_name,

      sp.shop_name,
      sp.company_name,
      sp.logo,
      sp.slug,
      sp.created_at AS seller_created_at,
      sp.is_verified,

      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'image', pi.image,
            'url', pi.url
          )
        ),
        JSON_ARRAY()
      ) AS images

    FROM products p

    LEFT JOIN categories c
      ON c.id = p.category_id

    LEFT JOIN subcategories sc
      ON sc.id = p.subcategory_id

    LEFT JOIN product_images pi
      ON pi.product_id = p.id

    LEFT JOIN seller_profiles sp
      ON sp.user_id = p.seller_id

    ${where}

    GROUP BY
      p.id,
      c.name,
      sc.name,
      sp.shop_name,
      sp.company_name,
      sp.logo,
      sp.slug,
      sp.created_at,
      sp.is_verified

    ORDER BY p.created_at DESC

    LIMIT ?
    OFFSET ?
    `,
    productParams,
  );

  return {
    products: rows.map((product: any) => ({
      ...product,
      images:
        typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images,
    })),

    page: Number(page),
    limit: Number(limit),
    total: count.total,
    totalPages: Math.ceil(count.total / limit),
  };
};

export const getCurrtentProdcut = async (id: string) => {
  const [rows] = await connection.query(
    `
    SELECT
      p.*,

      c.name AS category_name,
      sc.name AS subcategory_name,

      sp.shop_name,
      sp.company_name,
      sp.logo,
      sp.slug,
      sp.created_at AS seller_created_at,
      sp.is_verified,
sp.banner,

      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'url', pi.url
          )
        ),
        JSON_ARRAY()
      ) AS images

    FROM products p

    LEFT JOIN categories c
      ON c.id = p.category_id

    LEFT JOIN subcategories sc
      ON sc.id = p.subcategory_id

    LEFT JOIN product_images pi
      ON pi.product_id = p.id

    LEFT JOIN seller_profiles sp
      ON sp.user_id = p.seller_id

    WHERE p.id = ?

    GROUP BY
      p.id,
      c.name,
      sc.name,
      sp.shop_name,
      sp.company_name,
      sp.logo,
      sp.slug,
      sp.created_at,
      sp.is_verified
    `,
    [id],
  );

  return (rows as any[])[0] ?? null;
};

export const getCurrtentProdcutByID = async (id: string) => {
  const [rows] = await connection.query("SELECT * FROM products WHERE id = ?", [
    id,
  ]);
  const row = (rows as any[])[0];
  if (!row) {
    return null;
  }
  return row;
};

export const saveOrderToDB = async (data: any) => {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    const {
      customer,
      address,
      delivery,
      payment,
      products,
      user_id: userId = null,
    } = data;

    const deliveryMethod = delivery.method.toUpperCase();

    let productsTotal = 0;

    const productsData: any[] = [];

    // 1. Sprawdzenie produktów i blokada rekordów
    for (const item of products) {
      const [rows]: any = await conn.query(
        `
        SELECT
          id,
          name,
          price,
          stock,
          product_data
        FROM products
        WHERE id = ?
        FOR UPDATE
        `,
        [item.id],
      );

      if (!rows.length) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const product = rows[0];

      if (product.stock < item.quantity) {
        throw new Error("OUT_OF_STOCK");
      }

      productsTotal += Number(product.price) * item.quantity;

      productsData.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.product_data?.image ?? null,
      });
    }

    const finalTotal = productsTotal + Number(delivery.price);

    const orderNumber = await generateOrderNumber();

    // 2. Tworzenie zamówienia
    const [orderResult]: any = await conn.query(
      `
      INSERT INTO orders
      (
        user_id,
        address_id,

        customer_name,
        customer_last_name,
        email,
        customer_phone,

        delivery_method,
        delivery_price,

        payment_method,

        locker_id,
        locker_name,
        locker_address,

        total_price,
        order_number,
        status
      )

      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        userId,

        address?.id ?? null,

        customer.name,
        customer.last_name,
        customer.email,
        customer.phone,

        deliveryMethod,
        delivery.price,

        payment.method,

        deliveryMethod === "LOCKER" ? delivery.locker?.id : null,

        deliveryMethod === "LOCKER" ? delivery.locker?.name : null,

        deliveryMethod === "LOCKER" ? delivery.locker?.address : null,

        finalTotal,

        orderNumber,
        "NEW",
      ],
    );

    const orderId = orderResult.insertId;

    if (!orderId) {
      throw new Error("ORDER_CREATION_FAILED");
    }

    // 3. Dodanie produktów do zamówienia
    for (const product of productsData) {
      await conn.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          quantity,
          price,
          image
        )

        VALUES(?,?,?,?,?,?)
        `,
        [
          orderId,
          product.id,
          product.name,
          product.quantity,
          product.price,
          product.image,
        ],
      );

      // 4. Aktualizacja magazynu

      await conn.query(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
        `,
        [product.quantity, product.id],
      );

      // 5. Ukrycie produktu gdy brak sztuk

      await conn.query(
        `
        UPDATE products
        SET is_visible = 0
        WHERE id = ?
        AND stock <= 0
        `,
        [product.id],
      );
    }

    await conn.commit();

    return {
      orderId,
      orderNumber,
      total: finalTotal,
      success: true,
    };
  } catch (error) {
    await conn.rollback();

    throw error;
  } finally {
    conn.release();
  }
};

export const getCategoriesFromDB = async () => {
  const [rows] = await connection.query("SELECT * FROM categories");
  if (!rows) {
    return null;
  }
  return rows;
};

export const getSubcategoriesFromDB = async () => {
  const [rows] = await connection.query("SELECT * FROM subcategories");

  if (!rows) {
    return null;
  }
  return rows;
};
