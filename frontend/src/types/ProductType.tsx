export interface ProductImage {
  image: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Seller {
  seller_id: number;
  shop_name: string;
  company_name: string;
  logo: string | null;
  slug: string;
  is_verified: boolean;
  created_at: string;
}

export interface Product {
  id: number;

  external_id: string | null;

  name: string;

  description: string;

  price: number;

  stock: number;

  brand: string | null;

  model: string | null;

  category_id: number | null;

  subcategory_id: number | null;

  category_name?: string;

  subcategory_name?: string;

  seller_id: number;

  seller?: Seller;

  images: ProductImage[];

  attributes: ProductAttribute[];

  product_data?: any;

  is_visible: boolean;

  is_deleted: boolean;

  created_at: string;

  updated_at: string;
}
