import { Link } from "react-router-dom";
import { LogIn, UserPlus, User, Store, Shield, LogOut, X } from "lucide-react";
import { useSeller } from "../../../hooks/useSeller";
import { useEffect, useRef } from "react";

type Props = {
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  onClose: () => void;
  seller: [];
};

const AccountDropdown = ({ isAuthenticated, user, logout, onClose }: Props) => {
  const {
    getCompanyInfo: { data },
  } = useSeller();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const itemClass = "flex items-center gap-3 px-4 py-2 transition hover:bg-(--surface-secondary) hover:text-orange-500";

  return (
    <div
      ref={dropdownRef}
      className="absolute top-18 right-0 z-50 border border-(--border) bg-(--surface) p-2 text-(--foreground) shadow-xl"
    >
      {!isAuthenticated ? (
        <>
          <Link to="/login" onClick={onClose} className={itemClass}>
            <LogIn size={18} />
            Zaloguj się
          </Link>

          <Link to="/register" onClick={onClose} className={itemClass}>
            <UserPlus size={18} />
            Rejestracja
          </Link>
        </>
      ) : (
        <>
          <div className="border-b border-(--border) px-4 py-3">
            <p className="text-sm text-(--foreground-secondary)">Zalogowany:</p>

            <strong className="text-sm">{user?.email}</strong>
          </div>

          <Link to="/profile" onClick={onClose} className={itemClass}>
            <User size={18} />
            Mój profil
          </Link>

          {user?.role === "SELLER" && user?.id === data?.user_id && (
            <Link to="/seller/dashboard" onClick={onClose} className={itemClass}>
              <Store size={18} />
              Panel sprzedawcy
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link to="/admin" onClick={onClose} className={itemClass}>
              <Shield size={18} />
              Panel administratora
            </Link>
          )}

          {user?.role !== "ADMIN" && user?.id !== data?.user_id && (
            <Link to="/seller/create" onClick={onClose} className={itemClass}>
              <Store size={18} />
              Zostań sprzedawcą
            </Link>
          )}

          <button
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-red-500 transition hover:bg-red-500/10"
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
