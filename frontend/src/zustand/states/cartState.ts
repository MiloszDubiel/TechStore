import type { Product } from "../../types/ProductType";
import { create } from "zustand";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  toggleShowCart: boolean;

  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;

  setToggleShowCart: (show: boolean) => void;

  removeSellerProducts: (sellerId: number) => void;
}

const getStoredCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem("cart");

    if (!cart) return [];

    return JSON.parse(cart);
  } catch {
    return [];
  }
};

const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const useCartStore = create<CartStore>((set) => ({
  cart: getStoredCart(),

  toggleShowCart: false,

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);

      let updatedCart: CartItem[];

      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...state.cart,

          {
            ...product,
            quantity: 1,
          },
        ];
      }

      saveCart(updatedCart);

      return {
        cart: updatedCart,
      };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);

      saveCart(updatedCart);

      return {
        cart: updatedCart,
      };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const safeQuantity = Math.max(1, Math.min(quantity, item.stock));

        return {
          ...item,
          quantity: safeQuantity,
        };
      });

      saveCart(updatedCart);

      return {
        cart: updatedCart,
      };
    }),

  clearCart: () =>
    set(() => {
      saveCart([]);

      return {
        cart: [],
      };
    }),

  setToggleShowCart: (show) =>
    set({
      toggleShowCart: show,
    }),

  removeSellerProducts: (sellerId) =>
    set((state) => {
      const updatedCart = state.cart.filter(
        (product) => product.seller_id !== sellerId
      );

      saveCart(updatedCart);

      return {
        cart: updatedCart,
      };
    }),
}));
