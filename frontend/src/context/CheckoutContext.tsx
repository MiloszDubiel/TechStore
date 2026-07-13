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

type CheckoutContextType = {
  checkoutData: CheckoutData;
  setCheckoutData: React.Dispatch<React.SetStateAction<CheckoutData>>;
  isComplete: boolean;
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
  updateCheckout: (data: any) => void;
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
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
  });
  const [isComplete, setIsComplete] = useState(false);

  const updateCheckout = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => {
      const updated = {
        ...prev,
        ...data,
      };

      // zabezpieczenie przed niepotrzebnym rerenderem
      if (JSON.stringify(prev) === JSON.stringify(updated)) {
        return prev;
      }

      return updated;
    });
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        setCheckoutData,
        isComplete,
        setIsComplete,
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
