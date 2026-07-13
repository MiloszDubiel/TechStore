import type React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useCartStore } from "../zustand/states/cartState";

type Props = {
  children: React.ReactNode;
};

export const CheckIsLoggedIn = ({ children }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const CheckIsEmptyCart = ({ children }: Props) => {
  const cart = useCartStore((state) => state.cart);

  if (!cart.length) {
    return <Navigate to="/cart" replace />;
  }

  return <>{children}</>;
};
