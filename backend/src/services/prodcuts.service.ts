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
