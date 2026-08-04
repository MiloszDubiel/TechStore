import { Link } from "react-router-dom";
import { LogIn, UserPlus, User, Store, Shield, LogOut } from "lucide-react";
import { useSeller } from "../../../hooks/useSeller";
import { useEffect, useRef } from "react";

type Props = {
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  onClose: () => void;
  seller: [];
};

const AccountDropdown = ({
  isAuthenticated,
  user,
  logout,
  onClose,
}: Props) => {
  const {
    getCompanyInfo: { data },
  } = useSeller();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div
      className="top-10 absolute right-0 z-50 w-56 bg-white border border-gray-300 shadow-lg"
      ref={dropdownRef}
    >
      {!isAuthenticated ? (
        <>
          <Link
            to="/login"
            onClick={close}
            className="hover:bg-orange-50 flex items-center gap-3 px-4 py-2"
          >
            <LogIn size={18} />
            Zaloguj się
          </Link>

          <Link
            to="/register"
            onClick={close}
            className="hover:bg-orange-50 flex items-center gap-3 px-4 py-2"
          >
            <UserPlus size={18} />
            Rejestracja
          </Link>
        </>
      ) : (
        <>
          <div className="px-4 py-3 border-b border-gray-300">
            <p className="text-sm text-gray-500">Zalogowany:</p>
            <strong>{user?.email}</strong>
          </div>

          <Link
            to="/profile"
            onClick={close}
            className="hover:bg-orange-50 flex items-center gap-3 px-4 py-2"
          >
            <User size={18} />
            Mój profil
          </Link>

          {user?.role === "SELLER" && user?.id === data?.user_id && (
            <Link
              to="/seller/dashboard"
              onClick={close}
              className="hover:bg-orange-50 flex items-center gap-3 px-4 py-2"
            >
              <Store size={18} />
              Panel sprzedawcy
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={close}
              className="hover:bg-orange-50 flex items-center gap-3 px-4 py-2"
            >
              <Shield size={18} />
              Panel administratora
            </Link>
          )}

          {user?.role !== "ADMIN" && user?.id !== data?.user_id && (
            <Link
              to="/seller/create"
              onClick={close}
              className="hover:bg-orange-50 flex items-center gap-3 px-4 py-2"
            >
              <Store size={18} />
              Zostań sprzedawcą
            </Link>
          )}

          <button
            onClick={logout}
            className="hover:bg-red-50 flex items-center w-full gap-3 px-4 py-2 text-left text-red-500 cursor-pointer"
          >
            <LogOut size={18} />
            Wyloguj
          </button>
        </>
      )}
    </div>
  );
};

export default AccountDropdown;
