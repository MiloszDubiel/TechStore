import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../zustand/states/cartState";
import { useSeller } from "../hooks/useSeller";
import { useUser } from "../hooks/useUser";
import LoadingScreen from "./LoadingScreen";
import { useCheckout } from "../zustand/states/checkOutStore";

type Props = {
  children: React.ReactNode;
};

export const CheckIsLoggedOut = ({ children }: Props) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const CheckIsLoggedIn = ({ children }: Props) => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return <LoadingScreen />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const CheckIsEmptyCart = ({ children }: Props) => {
  const cart = useCartStore((state) => state.cart);
  const isComplete = useCheckout((state) => state.isComplete);

  if (cart.length === 0 && !isComplete) {
    return <Navigate to="/cart" replace />;
  }

  return children;
};

export const CheckIsSeller = ({ children }: Props) => {
  const { user } = useAuth();

  const {
    getCompanyInfo: { data: seller, isPending },
  } = useSeller();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (user?.role === "SELLER" && !seller) {
    return <Navigate to="/seller/create" replace />;
  }

  return children;
};

type ProtectedProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedProps) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
