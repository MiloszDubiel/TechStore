import type { Product } from "../../types/ProductType";
import { create } from "zustand";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  toggleShowCart: boolean;

  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setToggleShowCart: (show: boolean) => void;
}

const getStoredCart = (): CartItem[] => {
  const cart = localStorage.getItem("cart");

  if (!cart) return [];

  return JSON.parse(cart);
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
            : item,
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
}));
