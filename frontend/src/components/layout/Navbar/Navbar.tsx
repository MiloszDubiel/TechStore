import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../../context/AuthContext";

import SearchBar from "./SearchBar";
import NavbarActions from "./NavbarActions";
import { useSeller } from "../../../hooks/useSeller";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const { i18n } = useTranslation();

  const [search, setSearch] = useState("");

  const { logout, isAuthenticated, user } = useAuth();
  const {
    getCompanyInfo: { data },
  } = useSeller();

  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "pl" ? "en" : "pl");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Wylogowano pomyślnie!");
  };

  return (
    <nav className="flex w-full items-center justify-between border-b border-(--border) bg-(--surface) px-6 py-3 text-(--foreground) shadow-md">
      <Link to="/" className="text-2xl font-bold text-orange-500">
        IT E-commerce
      </Link>

      <div className="flex items-center flex-1 gap-6 mx-6">
        <SearchBar search={search} setSearch={setSearch} />

        <Link
          to="/offers"
          className="whitespace-nowrap font-medium text-(--foreground-secondary) transition hover:text-orange-500"
        >
          Wszystkie produkty
        </Link>
      </div>

      <NavbarActions
        toggleLanguage={toggleLanguage}
        language={i18n.language}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={handleLogout}
        seller={data}
      />
    </nav>
  );
};
export default Navbar;
