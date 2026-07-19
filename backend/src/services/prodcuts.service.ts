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
  const { categories, brands, min, max, stock, search } = params;

  let query = `
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

    WHERE 1 = 1 AND p.stock > 0
  `;

  const queryParams: any[] = [];

  if (categories) {
    const cats = categories.split(",");

    query += `
      AND c.name IN (${cats.map(() => "?").join(",")})
    `;

    queryParams.push(...cats);
  }

  if (brands) {
    const b = brands.split(",");

    query += `
      AND p.brand IN (${b.map(() => "?").join(",")})
    `;

    queryParams.push(...b);
  }

  if (min) {
    query += `
      AND p.price >= ?
    `;

    queryParams.push(Number(min));
  }

  if (max) {
    query += `
      AND p.price <= ?
    `;

    queryParams.push(Number(max));
  }

  if (stock === "1") {
    query += `
      AND p.stock > 0
    `;
  }

  if (search) {
    query += `
      AND p.name LIKE ?
    `;

    queryParams.push(`%${search}%`);
  }

  query += `
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
  `;

  const [rows]: any = await connection.query(query, queryParams);

  return rows.map((product: any) => ({
    ...product,
    images:
      typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images,
  }));
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
      sp.description,
sp.banner,

      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'image', pi.image_url
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

export const saveOrderToDB = async (userId: string | null, data: any) => {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    const { customer, address, delivery, payment, products } = data;

    const deliveryMethod = delivery.method.toUpperCase();

    let totalPrice = 0;

    const productsData: any[] = [];

    for (const item of products) {
      const [rows]: any = await conn.query(
        `
        SELECT
          id,
          name,
          model,
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

      totalPrice += Number(product.price) * item.quantity;

      productsData.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.product_data?.image ?? null,
        quantity: item.quantity,
      });
    }

    let addressId = null;

    if (deliveryMethod === "COURIER") {
      if (!address) {
        throw new Error("ADDRESS_REQUIRED");
      }

      const [addressResult]: any = await conn.query(
        `
        INSERT INTO order_addresses
        (
          user_id,
          first_name,
          last_name,
          street,
          postal_code,
          city,
          country,
          phone
        )

        VALUES(?,?,?,?,?,?,?,?)
        `,
        [
          userId,

          customer.name,

          customer.last_name,

          address.street,

          address.postal_code,

          address.city,

          address.country ?? "Polska",

          customer.phone,
        ],
      );

      addressId = addressResult.insertId;
    }

    const orderNumber = await generateOrderNumber();

    const [orderResult]: any = await conn.query(
      `
      INSERT INTO orders
      (
        user_id,
        address_id,
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

      VALUES(?,?,?,?,?,?,?,?,?,?,'NEW')
      `,
      [
        userId,

        addressId,

        deliveryMethod,

        delivery.price,

        payment.method,

        deliveryMethod === "LOCKER" ? delivery.locker?.id : null,

        deliveryMethod === "LOCKER" ? delivery.locker?.name : null,

        deliveryMethod === "LOCKER" ? delivery.locker?.address : null,

        totalPrice + Number(delivery.price),

        orderNumber,
      ],
    );

    const orderId = orderResult.insertId;

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

      await conn.query(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
        `,
        [product.quantity, product.id],
      );

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
      success: true,
      orderId,
      orderNumber,
    };
  } catch (err) {
    await conn.rollback();

    throw err;
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
