import { describe, expect, it } from "vitest";
import { useCartStore } from "../../zustand/states/cartState";
import { beforeEach } from "vitest";
import type { Product } from "../../types/ProductType";

export const mockProduct: Product = {
  id: 1,
  external_id: "EXT-001",
  name: "Lenovo G510",
  description: "Laptop Lenovo G510 z procesorem Intel Core i5",
  price: 1499.99,
  stock: 10,
  brand: "Lenovo",
  model: "G510",
  category_id: 1,
  subcategory_id: 2,
  category_name: "Laptopy",
  subcategory_name: "Laptopy używane",
  seller_id: 5,
  seller: undefined,
  images: [],
  attributes: [],
  product_data: {
    manufacturer: "Lenovo",
    model: "G510",
    processor: "Intel Core i5",
    ram: 8,
    storage: 512,
    screen: 15.6,
    battery: 50,
    system: "Windows 10",
  },
  is_visible: true,
  is_deleted: false,
  created_at: "2026-08-13T10:00:00.000Z",
  updated_at: "2026-08-13T10:00:00.000Z",
};

const mockProduct2: Product = {
  id: 2,
  external_id: "EXT-002",
  name: "Dell Latitude E5470",
  description: "Laptop Dell Latitude E5470 z procesorem Intel Core i5",
  price: 1199.99,
  stock: 5,
  brand: "Dell",
  model: "Latitude E5470",
  category_id: 1,
  subcategory_id: 3,
  category_name: "Laptopy",
  subcategory_name: "Laptopy biznesowe",
  seller_id: 8,
  seller: undefined,
  images: [],
  attributes: [],
  product_data: {
    manufacturer: "Dell",
    model: "Latitude E5470",
    processor: "Intel Core i5-6300U",
    ram: 8,
    storage: 256,
    screen: 14,
    battery: 42,
    system: "Windows 10",
  },
  is_visible: true,
  is_deleted: false,
  created_at: "2026-08-13T10:00:00.000Z",
  updated_at: "2026-08-13T10:00:00.000Z",
};
describe("Cart tests: ", () => {
  /*beforeEach - to blok kodu uruchamiany przed każdym testem w danym pliku lub grupie testowej.*/

  beforeEach(() => {
    //Umozliwia dostania się do aktualnego stanu store'a bez renderowania Reacta
    localStorage.clear();
    useCartStore.setState({
      cart: [],
    });
  });

  it("Should add a new product with quantity 1", () => {
    useCartStore.getState().addToCart(mockProduct);

    const cart = useCartStore.getState().cart;

    expect(cart).toEqual([
      {
        ...mockProduct,
        quantity: 1,
      },
    ]);
  });

  it("should increases quantity when product already exists", () => {
    useCartStore.setState({
      cart: [
        {
          ...mockProduct,
          quantity: 1,
        },
      ],
    });

    useCartStore.getState().updateQuantity(mockProduct.id, 3);

    const cart = useCartStore.getState().cart;

    expect(cart).toEqual([
      {
        ...mockProduct,
        quantity: 3,
      },
    ]);
  });
  it("should decreases number of products when product is deleted", () => {
    useCartStore.setState({
      cart: [
        {
          ...mockProduct,
          quantity: 1,
        },
        { ...mockProduct2, quantity: 2 },
      ],
    });

    useCartStore.getState().removeFromCart(mockProduct.id);

    const cart = useCartStore.getState().cart;

    expect(cart).toEqual([{ ...mockProduct2, quantity: 2 }]);
  });

  it("should clear a cart ", () => {
    useCartStore.setState({
      cart: [
        {
          ...mockProduct,
          quantity: 1,
        },
        { ...mockProduct2, quantity: 2 },
      ],
    });

    useCartStore.getState().clearCart();

    const cart = useCartStore.getState().cart;

    expect(cart).toEqual([]);
  });
});
