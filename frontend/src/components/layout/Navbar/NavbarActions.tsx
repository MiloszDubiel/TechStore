import { Heart, ShoppingCart, Bell, MessageCircle, User } from "lucide-react";

import { useState, useCallback } from "react";

import FavoritesDropdown from "./FavoriteDropdown";
import CartDropdown from "./CartDropdown";
import AccountDropdown from "./AccountDropdown";

const NavbarActions = ({
  toggleLanguage,
  language,
  isAuthenticated,
  user,
  logout,
  seller,
}: any) => {
  const [active, setActive] = useState<any>(null);

  const createSlug = useCallback(
    (name: string) => name.toLowerCase().replace(/\s+/g, "-"),
    []
  );

  return (
    <div className="flex items-center gap-6">
      <button onClick={toggleLanguage}>
        {language === "pl" ? "EN" : "PL"}
      </button>

      <div className="relative cursor-pointer">
        <Heart onClick={() => setActive(active === "fav" ? null : "fav")} />

        {active === "fav" && (
          <FavoritesDropdown
            createSlug={createSlug}
            close={() => setActive(null)}
          />
        )}
      </div>

      <MessageCircle className="cursor-pointer" />

      <Bell className="cursor-pointer" />

      <div className="relative">
        <ShoppingCart
          className="cursor-pointer"
          onClick={() => setActive(active === "cart" ? null : "cart")}
        />

        {active === "cart" && <CartDropdown />}
      </div>

      <div className=" relative">
        <button
          onClick={() => setActive(active === "account" ? null : "account")}
          className="hover:text-orange-500 flex items-center gap-3 cursor-pointer"
        >
          {isAuthenticated ? (
            <>
              <div className="lg:block hidden text-left">
                <p className="font-medium leading-none">
                  {user?.name} {user?.last_name}
                </p>

                <p className="mt-1 text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-orange-500 rounded-full">
                {user?.name?.[0]}
                {user?.last_name?.[0]}

                {!user?.name?.[0] && !user?.last_name?.[0] && (
                  <User size={22} />
                )}
              </div>
            </>
          ) : (
            <User size={22}  />
          )}
        </button>

        {active === "account" && (
          <AccountDropdown
            isAuthenticated={isAuthenticated}
            user={user}
            logout={logout}
            close={() => setActive(null)}
            seller={seller}
          />
        )}
      </div>
    </div>
  );
};

export default NavbarActions;
