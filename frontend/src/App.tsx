import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import OffersList from "./pages/OffersList/OffersList";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import Footer from "./components/layout/Footer";
import CartPage from "./pages/CartPage/CartPage";
import OfferDetails from "./components/ui/OfertDetails";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import CheckoutLayout from "./pages/CartPage/checkout/CheckoutLayout";
import Chat from "./pages/ChatPage/Chat";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoritesContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { NotificationProvider } from "./context/NotificationContext";
import {
  CheckIsEmptyCart,
  CheckIsLoggedIn,
  CheckIsLoggedOut,
  CheckIsSeller,
  ProtectedRoute,
} from "./components/ProtectetRoutes";

import BecomeSellerPage from "./pages/SellerPage/BecomeSellerPage";
import SellerDashboard from "./pages/SellerPage/SellerDashboardPage/SellerDashboard";
import SellerPage from "./pages/SellerPage/SellerPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";

const AppContent = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/offers" element={<OffersList />} />

            <Route path="/offers/:slug/:id" element={<OfferDetails />} />

            <Route path="/seller/:slug/:id" element={<SellerPage />} />

            <Route
              path="/login"
              element={
                <CheckIsLoggedOut>
                  <LoginPage />
                </CheckIsLoggedOut>
              }
            />

            <Route
              path="/register"
              element={
                <CheckIsLoggedOut>
                  <RegisterPage />
                </CheckIsLoggedOut>
              }
            />

            <Route
              path="/profile"
              element={
                <CheckIsLoggedIn>
                  <SettingsPage />
                </CheckIsLoggedIn>
              }
            />

            <Route path="/cart" element={<CartPage />} />

            <Route
              path="/cart/checkout"
              element={
                <CheckIsEmptyCart>
                  <CheckoutLayout />
                </CheckIsEmptyCart>
              }
            />

            <Route
              path="/seller/create"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <CheckIsLoggedIn>
                    <BecomeSellerPage />
                  </CheckIsLoggedIn>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <CheckIsLoggedIn>
                  <Chat />
                </CheckIsLoggedIn>
              }
            />

            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <CheckIsLoggedIn>
                    <CheckIsSeller>
                      <SellerDashboard />
                    </CheckIsSeller>
                  </CheckIsLoggedIn>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CheckoutProvider>
          <FavoriteProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </FavoriteProvider>
        </CheckoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
