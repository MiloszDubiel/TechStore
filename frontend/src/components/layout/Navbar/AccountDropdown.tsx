import { Link } from "react-router-dom";

type Props = {
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  close: () => void;
  seller: [];
};

const AccountDropdown = ({
  isAuthenticated,
  user,
  logout,
  close,
  seller = [],
}: Props) => {
  console.log(seller);
  return (
    <div className=" top-10 absolute right-0 z-50 w-56 bg-white border border-gray-300 shadow-lg">
      {!isAuthenticated ? (
        <>
          <Link
            to="/login"
            onClick={close}
            className="hover:bg-orange-50 block px-4 py-2"
          >
            Zaloguj się
          </Link>

          <Link
            to="/register"
            onClick={close}
            className="hover:bg-orange-50 block px-4 py-2"
          >
            Rejestracja
          </Link>
        </>
      ) : (
        <>
          <div className="px-4 py-3 border-b border-gray-300">
            <p className="text-sm">Zalogowany:</p>

            <strong>{user?.email}</strong>
          </div>

          <Link to="/profile" onClick={close} className="block px-4 py-2">
            Mój profil
          </Link>

          {user?.role === "SELLER" && seller && (
            <Link
              to="/seller/dashboard"
              onClick={close}
              className="block px-4 py-2"
            >
              Panel sprzedawcy
            </Link>
          )}

          {user?.role === "SELLER" && !seller && (
            <Link
              to="/seller/create"
              onClick={close}
              className="block px-4 py-2"
            >
              Zostań sprzedawcą
            </Link>
          )}

          <button
            onClick={logout}
            className=" w-full px-4 py-2 text-left text-red-500"
          >
            Wyloguj
          </button>
        </>
      )}
    </div>
  );
};
export default AccountDropdown;
