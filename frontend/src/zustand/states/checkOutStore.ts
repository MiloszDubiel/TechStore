import { create } from "zustand";

export type CustomerData = {
  name: string;
  last_name: string;
  email: string;
  phone?: string;
};

export type AddressData = {
  id?: number | string;
  street: string;
  postal_code: string;
  city: string;
  country?: string;
  is_default?: boolean;
};

export type LockerData = {
  id: string;
  name: string;
  address: string;
  position?: [number, number];
};

export type DeliveryData = {
  method: "courier" | "locker";
  price: number;
  locker: LockerData | null;
};

export type PaymentData = {
  method: "blik" | "card" | "transfer" | "cash";
};

export type CheckoutData = {
  customer: CustomerData | null;
  address: AddressData | null;
  delivery: DeliveryData;
  payment: PaymentData;
};

type useCheckoutTypes = {
  checkoutData: CheckoutData;
  isComplete: boolean;
  setCheckoutData: (data: Partial<CheckoutData>) => any;
  setIsComplete: (data: boolean) => any;
};

export const useCheckout = create<useCheckoutTypes>((set) => ({
  checkoutData: {
    customer: null,

    address: null,

    delivery: {
      method: "courier",
      price: 15,
      locker: null,
    },

    payment: {
      method: "blik",
    },
  },

  isComplete: false,

  setCheckoutData: (data: Partial<CheckoutData>) =>
    set((state) => ({
      checkoutData: {
        ...state.checkoutData,
        ...data,
      },
    })),

  setIsComplete: (data: boolean) =>
    set({
      isComplete: data,
    }),
}));
