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
    <nav className="flex h-18 w-full items-center justify-between border-b border-(--border) bg-(--surface) px-6 py-3 text-(--foreground) shadow-md">
      <Link to="/" className="text-2xl font-bold text-orange-500">
        IT E-commerce
      </Link>

      <div className="mx-2 hidden flex-1 items-center gap-4 lg:flex 2xl:mx-6">
        <SearchBar search={search} setSearch={setSearch} />

        <Link
          to="/offers"
          className="text-sm font-medium whitespace-nowrap text-(--foreground-secondary) transition-colors hover:text-orange-500 2xl:text-base"
        >
          Wszystkie produkty
        </Link>
      </div>

      <div className="text-( --foreground) m-8 flex min-w-0 flex-1 items-center lg:hidden">
        <div className="borde flex cursor-pointer items-center gap-2.5 p-2">
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
