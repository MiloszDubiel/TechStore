import { createContext, useContext, useState, type ReactNode } from "react";

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
  lockerName: string;
  address: string;
  position?: [number, number];
};

export type DeliveryData = {
  method?: "courier" | "locker";

  price: number;
  locker?: LockerData;
};

export type PaymentData = {
  method?: "blik" | "card" | "transfer" | "cash";
};

export type CheckoutData = {
  customer: CustomerData | null;

  address: AddressData | null;

  delivery: DeliveryData | null;

  payment: PaymentData | null;
};

type CheckoutContextType = {
  checkoutData: CheckoutData;

  updateCheckout: (data: Partial<CheckoutData>) => void;
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer: null,

    address: null,

    delivery: {
      method: "courier",
      price: 0,
    },

    payment: {
      method: "blik",
    },
  });

  const updateCheckout = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        updateCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckout musi być wewnątrz CheckoutProvider");
  }

  return context;
};
