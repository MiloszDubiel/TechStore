import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import OffersList from "./pages/OffersList/OffersList";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import Footer from "./components/layout/Footer";
import CartPage from "./pages/CartPage/CartPage";
import OfferDetails from "./pages/OfferDetails/OfferDetails";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import CheckoutLayout from "./pages/CartPage/checkout/CheckoutLayout";
import Chat from "./pages/ChatPage/Chat";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { CheckIsEmptyCart, CheckIsLoggedIn, CheckIsLoggedOut, CheckIsSeller, ProtectedRoute } from "./components/ProtectetRoutes";

import BecomeSellerPage from "./pages/SellerPage/BecomeSellerPage";
import SellerDashboard from "./pages/SellerPage/SellerDashboardPage/SellerDashboard";
import SellerPage from "./pages/SellerPage/SellerPage";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Navbar from "./components/layout/Navbar/Navbar";

const AppContent = () => {
  const { isLoggingOut } = useAuth();

  if (isLoggingOut) {
    return (
      <>
        {isLoggingOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-lg">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

              <p>Wylogowywanie...</p>
            </div>
          </div>
        )}

        <App />
      </>
    );
  }
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-(--background)">
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
                      <SellerDashboard>
                        <Navbar />
                      </SellerDashboard>
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
        <FavoriteProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </FavoriteProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
export default App;
