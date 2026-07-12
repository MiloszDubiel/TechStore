import { connection } from "../config/db.config";
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

  let query = "SELECT * FROM products WHERE 1=1";
  const queryParams: any[] = [];

  if (categories) {
    const cats = (categories as string).split(",");
    query += ` AND category_name IN (${cats.map(() => "?").join(",")})`;
    queryParams.push(...cats);
  }

  if (brands) {
    const b = (brands as string).split(",");
    query += ` AND brand IN (${b.map(() => "?").join(",")})`;
    queryParams.push(...b);
  }

  if (min) {
    query += " AND price >= ?";
    queryParams.push(Number(min));
  }

  if (max) {
    query += " AND price <= ?";
    queryParams.push(Number(max));
  }

  if (stock === "1") {
    query += " AND stock > 0";
  }

  if (search) {
    query += " AND product_data LIKE ?";
    queryParams.push(`%${search}%`);
  }

  const [rows]: any = await connection.query(query, queryParams);

  return rows.map((product: any) => {
    const mapped = mapMainCategory(product.category_name);
    return {
      ...product,
      main_category: mapped?.main,
      sub_category: mapped?.sub,
    };
  });
};

export const getCurrtentProdcut = async (id: string) => {
  const [rows] = await connection.query("SELECT * FROM products WHERE id = ?", [
    id,
  ]);
  const row = (rows as any[])[0];
  if (!row) {
    return null;
  }
  return row;
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

    let totalPrice = 0;

    const productsData: any[] = [];

    for (const item of products) {
      const [rows]: any = await conn.query(
        `
SELECT
id,
model,
price,
stock,
product_data

FROM products

WHERE id=?

FOR UPDATE
`,

        [item.id],
      );

      if (!rows.length) throw new Error("PRODUCT_NOT_FOUND");

      const product = rows[0];

      if (product.stock < item.quantity) throw new Error("OUT_OF_STOCK");

      totalPrice += product.price * item.quantity;

      productsData.push({
        id: product.id,

        name: product.model,

        price: product.price,

        image: product.product_data?.image ?? null,

        quantity: item.quantity,
      });
    }

    // adres

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

    const addressId = addressResult.insertId;

    // order

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
status
)

VALUES(?,?,?,?,?,?,?,?,?,'PENDING')

`,

      [
        userId,

        addressId,

        delivery.method,

        delivery.price,

        payment.method,

        delivery.locker?.id ?? null,

        delivery.locker?.name ?? null,

        delivery.locker?.address ?? null,

        totalPrice + delivery.price,
      ],
    );

    const orderId = orderResult.insertId;

    // produkty

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

WHERE id=?

`,

        [product.quantity, product.id],
      );
    }

    await conn.commit();

    return {
      success: true,
      orderId,
    };
  } catch (err) {
    await conn.rollback();

    throw err;
  } finally {
    conn.release();
  }
};
