import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../../context/AuthContext";

import SearchBar from "./SearchBar";
import NavbarActions from "./NavbarActions";
import { useSeller } from "../../../hooks/useSeller";
import { toast } from "react-toastify";
import { SearchIcon } from "lucide-react";

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
    <nav className="flex w-full h-18  items-center justify-between border-b border-(--border) bg-(--surface) px-6 py-3 text-(--foreground) shadow-md ">
      <Link to="/" className="text-2xl font-bold text-orange-500">
        IT E-commerce
      </Link>

      <div className="lg:flex 2xl:mx-6 items-center flex-1 hidden gap-4 mx-2">
        <SearchBar search={search} setSearch={setSearch} />

        <Link
          to="/offers"
          className="
      whitespace-nowrap
      text-sm
      font-medium
      text-(--foreground-secondary)
      transition-colors
      hover:text-orange-500
      2xl:text-base
    "
        >
          Wszystkie produkty
        </Link>
      </div>

      <div className="lg:hidden flex items-center flex-1 min-w-0 m-8  text-( --foreground) ">
        <div className="flex items-center gap-2.5 p-2 borde cursor-pointer">
          <SearchIcon size={20} />
        </div>
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
