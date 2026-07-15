import React, { use, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Heart,
  MessageCircle,
  Bell,
  ShoppingCart,
  User,
  Search,
} from "lucide-react";
import { useCartStore } from "../../zustand/states/cartState";
import type { Product } from "../../types/ProductType";
import { useFavorite } from "../../context/FavoritesContext";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pl" ? "en" : "pl";
    i18n.changeLanguage(newLang);
  };

  const [search, setSearch] = useState<string>("");

  type ModalType = "cart" | "favorites" | "account" | "notifications" | null;

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { favorites } = useFavorite();

  const { cart, updateQuantity, clearCart, removeFromCart } = useCartStore(
    (state) => state
  );

  const { logout, isAuthenticated, user } = useAuth();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setActiveModal(null);
    navigate("/");
  };

  const createSlug = useCallback(
    (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    []
  );

  const searchProduct = useCallback(() => {
    const query = search.trim().toLowerCase();
    if (query) {
      navigate(`/offers?search=${encodeURIComponent(query)}&page=1`);
    }
  }, [search, navigate]);

  return (
    <nav className="relative flex items-center justify-between w-full px-6 py-3 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-orange-500">
        My IT Store
      </Link>

      <div className="flex items-center flex-1 gap-6 mx-6">
        <div className="focus-within:ring-2 focus-within:ring-orange-100 flex items-center w-1/3 overflow-hidden border border-gray-200">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="outline-0 w-full py-2 pl-10 pr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="left-3 top-1/2 absolute text-gray-400 -translate-y-1/2"
              size={18}
            />
          </div>

          <button
            className="hover:bg-orange-600 px-5 py-2 text-white transition bg-orange-500"
            onClick={searchProduct}
          >
            Szukaj
          </button>
        </div>

        <Link
          to="/offers"
          className="whitespace-nowrap hover:text-orange-600 font-medium text-gray-700 transition"
        >
          Wszystkie produkty
        </Link>
      </div>

      <div className=" relative flex items-center gap-6 text-gray-600">
        <button
          onClick={toggleLanguage}
          className="hover:bg-orange-50 hover:text-orange-600 px-3 py-1 font-medium transition border border-gray-300 cursor-pointer"
        >
          {i18n.language === "pl" ? "EN" : "PL"}
        </button>
        <div className="relative">
          <Heart
            size={22}
            className="hover:text-orange-600 cursor-pointer"
            onClick={() =>
              setActiveModal(activeModal === "favorites" ? null : "favorites")
            }
          />

          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          )}
          {activeModal === "favorites" && (
            <div className="absolute top-11.25 right-0 mt-3 w-125 bg-white border shadow-xl p-4 z-50 overflow-y-auto ax-h-[400px] border-gray-200">
              <h3 className="mb-3 text-lg font-bold">Ulubione produkty</h3>
              {favorites.length === 0 ? (
                <p>Nie masz jeszcze ulubionych produktów.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {favorites.map((product: Product) => {
                    return (
                      <li
                        key={product.id}
                        className="flex items-center gap-3 pb-2 border-b border-gray-200"
                      >
                        <div className="shrink-0 w-12 h-12">
                          <img
                            src={
                              product.product_data.images?.[0]?.url ||
                              "/no-image.png"
                            }
                            alt={product.product_data.name}
                            className=" object-cover w-full h-full"
                          />
                        </div>

                        <div className=" flex items-center justify-between flex-1 w-3/4">
                          <div
                            className="text-sm font-medium truncate"
                            style={{ maxWidth: "calc(100% - 60px)" }}
                            title={product.product_data.name}
                          >
                            {product.product_data.name}
                          </div>

                          <div className="shrink-0 ml-2 text-xs text-gray-500">
                            {product.price} zł
                          </div>
                        </div>

                        <Link
                          to={`/offers/${createSlug(
                            product.product_data.name
                          )}/${product.id}`}
                          className="hover:underline shrink-0 ml-3 text-xs text-orange-500"
                          onClick={() => setActiveModal(null)}
                        >
                          Zobacz
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
        {
          <MessageCircle
            size={22}
            className="hover:text-orange-600 cursor-pointer"
          />
        }
        <Bell size={22} className="hover:text-orange-600 cursor-pointer" />

        <div className="relative">
          <ShoppingCart
            size={22}
            className="hover:text-orange-600 cursor-pointer"
            onClick={() =>
              setActiveModal(activeModal === "cart" ? null : "cart")
            }
          />

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>

        {activeModal === "cart" && (
          <div className="absolute top-11.25 right-0 mt-3 w-125 bg-white border shadow-xl p-4 z-50  overflow-y-auto border-gray-200">
            <h2 className="mb-4 text-xl font-bold">Twój koszyk</h2>
            {cart.length === 0 ? (
              <p>Twój koszyk jest pusty.</p>
            ) : (
              <>
                <ul className="max-h-65 pr-2 overflow-y-auto">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 pb-3 mb-3 border-b border-gray-400"
                    >
                      <div className="shrink-0 w-16 h-16">
                        <img
                          src={
                            item.product_data.images?.[0]?.url ||
                            "/no-image.png"
                          }
                          alt={item.product_data.name}
                          className="object-cover w-full h-full rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="line-clamp-2 font-medium">
                          {item.product_data.name}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                );
                              }}
                              className="hover:bg-orange-500 px-2 py-1 bg-orange-100"
                            >
                              −
                            </button>

                            <span className="px-3 text-sm min-w-7.5 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                updateQuantity(
                                  item.id,
                                  Math.min(item.stock, item.quantity + 1)
                                );
                              }}
                              className="hover:bg-orange-500 px-2 py-1 bg-orange-100"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-sm text-gray-500">
                            x {item.price} zł
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          {(item.price * item.quantity).toFixed(2)} zł
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="hover:underline text-xs text-red-500 cursor-pointer"
                        >
                          Usuń
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Suma:</span>
                    <span>
                      {cart
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}{" "}
                      zł
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/cart");
                    }}
                    className="hover:bg-orange-600 w-full py-2 mt-3 text-white transition bg-orange-500 cursor-pointer"
                  >
                    Przejdź do koszyka
                  </button>

                  <button
                    onClick={() => clearCart()}
                    className="hover:underline w-full mt-2 text-sm text-red-500 cursor-pointer"
                  >
                    Wyczyść koszyk
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <div className="relative">
          <button
            onClick={() =>
              setActiveModal(activeModal === "account" ? null : "account")
            }
            className="hover:text-orange-600 flex items-center gap-2 transition cursor-pointer"
          >
            <span
              className={
                `flex ` + (isAuthenticated ? "flex-col items-end" : "")
              }
            >
              <span>
                {isAuthenticated && user?.name + " " + (!user?.last_name && "")}
                <br />
              </span>

              <span className="flex items-center justify-center text-xs">
                {isAuthenticated ? user?.email : "Konto"}
              </span>
            </span>
            <User size={22} />
          </button>

          {activeModal === "account" && (
            <div className=" absolute right-0 z-50 w-56 py-2 mt-2 bg-white border-gray-400 shadow-lg">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="hover:bg-orange-50 block px-4 py-2"
                    onClick={() => setActiveModal(null)}
                  >
                    Zaloguj się
                  </Link>

                  <Link
                    to="/register"
                    className="hover:bg-orange-50 block px-4 py-2"
                    onClick={() => setActiveModal(null)}
                  >
                    Zarejestruj się
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                    Zalogowany jako:
                    <div className="font-semibold">{user?.email}</div>
                  </div>

                  <Link
                    to="/profile"
                    className="hover:bg-orange-50 block px-4 py-2"
                    onClick={() => setActiveModal(null)}
                  >
                    Mój profil
                  </Link>

                  {user?.role === "USER" && (
                    <Link
                      to="/orders"
                      className="hover:bg-orange-50 block px-4 py-2"
                      onClick={() => setActiveModal(null)}
                    >
                      Moje zamówienia
                    </Link>
                  )}
                  {user?.role === "USER" && (
                    <Link
                      to="/seller/create"
                      className="hover:bg-orange-50 block px-4 py-2"
                      onClick={() => setActiveModal(null)}
                    >
                      Zostań sprzedawcą
                    </Link>
                  )}
                  {user?.role === "SELLER" && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className="hover:bg-orange-50 block px-4 py-2"
                        onClick={() => setActiveModal(null)}
                      >
                        Panel sprzedawcy
                      </Link>
                      <Link
                        to="/seller/products"
                        className="hover:bg-orange-50 block px-4 py-2"
                        onClick={() => setActiveModal(null)}
                      >
                        Moje produkty
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="hover:bg-red-50 w-full px-4 py-2 text-left text-red-600"
                  >
                    Wyloguj się
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
