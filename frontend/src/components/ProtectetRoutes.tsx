import type React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useCartStore } from "../zustand/states/cartState";
import { useCheckout } from "../context/CheckoutContext";
import { useUser } from "../hooks/useUser";
import { useLogin } from "../hooks/useLogin";
import { useSeller } from "../hooks/useSeller";

type Props = {
  children: React.ReactNode;
};

export const CheckIsLoggedOut = ({ children }: Props) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
export const CheckIsLoggedIn = ({ children }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const CheckIsEmptyCart = ({ children }: any) => {
  const cart = useCartStore((state) => state.cart);
  const { isComplete } = useCheckout();

  if (cart.length === 0 && !isComplete) {
    return <Navigate to="/cart" replace />;
  }

  return children;
};

export const CheckIsSeller = ({ children }: any) => {
  const { user } = useAuth();
  const {
    getCompanyInfo: { data },
  } = useSeller();

  if (user?.id === data?.seller_id) {
    return <Navigate to="/seller/create" replace />;
  }

  return children;
};
