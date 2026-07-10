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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CheckoutProvider>
        <FavoriteProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <div className="flex-1 h-fit">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/offers" element={<OffersList />} />
                  <Route path="/offers/:slug/:id" element={<OfferDetails />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route path="/cart" element={<CartPage />} />

                  <Route path="/profile" element={<SettingsPage />} />
                  <Route path="/cart/checkout" element={<CheckoutLayout />} />
                </Routes>
              </div>

              <Footer />
            </div>
          </BrowserRouter>
        </FavoriteProvider>
      </CheckoutProvider>
    </AuthProvider>
  );
};

export default App;
