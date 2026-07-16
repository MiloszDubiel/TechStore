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

      <div className="relative">
        <Heart onClick={() => setActive(active === "fav" ? null : "fav")} />

        {active === "fav" && (
          <FavoritesDropdown
            createSlug={createSlug}
            close={() => setActive(null)}
          />
        )}
      </div>

      <MessageCircle />

      <Bell />

      <div className="relative">
        <ShoppingCart
          onClick={() => setActive(active === "cart" ? null : "cart")}
        />

        {active === "cart" && <CartDropdown />}
      </div>

      <div className="relative">
        <User
          onClick={() => setActive(active === "account" ? null : "account")}
        />

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
