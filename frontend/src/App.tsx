import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import OffersList from "./pages/OffersList/OffersList";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";
import CartPage from "./pages/CartPage/CartPage";
import OfferDetails from "./components/ui/OfertDetails";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import CheckoutLayout from "./pages/CartPage/checkout/CheckoutLayout";
import { FavoriteProvider } from "./context/FavoritesContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import {
  CheckIsEmptyCart,
  CheckIsLoggedIn,
  CheckIsLoggedOut,
} from "./components/ProtectetRoutes";
import { ThemeProvider } from "./context/ThemeProvider";
import BecomeSellerPage from "./pages/SellerPage/BecomeSellerPage";
import SellerDashboard from "./pages/SellerDashboardPage/SellerDashboard";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CheckoutProvider>
          <FavoriteProvider>
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <div className="h-fit flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/offers" element={<OffersList />} />
                    <Route
                      path="/offers/:slug/:id"
                      element={<OfferDetails />}
                    />
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

                    <Route path="/cart" element={<CartPage />} />

                    <Route
                      path="/profile"
                      element={
                        <CheckIsLoggedIn>
                          <SettingsPage />
                        </CheckIsLoggedIn>
                      }
                    />
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
                      element={<BecomeSellerPage />}
                    />
                    <Route
                      path="/seller/dashboard"
                      element={<SellerDashboard />}
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>

                <Footer />
              </div>
            </BrowserRouter>
          </FavoriteProvider>
        </CheckoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
