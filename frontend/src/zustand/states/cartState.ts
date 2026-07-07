// import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
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
  updateQuantity: (...cart: any) => void;
  clearCart: () => void;
  setToggleShowCart: (show: boolean) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  toggleShowCart: false,

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => {
        if (item.id !== id) return item;

        const safeQuantity = Math.max(1, Math.min(quantity, item.stock));

        return {
          ...item,
          quantity: safeQuantity,
        };
      }),
    })),

  clearCart: () =>
    set({
      cart: [],
    }),

  setToggleShowCart: (show) =>
    set({
      toggleShowCart: show,
    }),
}));
