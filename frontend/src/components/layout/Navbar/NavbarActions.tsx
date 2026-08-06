import { Heart, ShoppingCart, Bell, MessageCircle, User } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";
import FavoritesDropdown from "./FavoriteDropdown";
import CartDropdown from "./CartDropdown";
import AccountDropdown from "./AccountDropdown";
import BellDropdown from "./BellDropdown";
import { useNotification } from "../../../context/NotificationContext";
import { useCartStore } from "../../../zustand/states/cartState";
import { useFavorite } from "../../../context/FavoritesContext";
import { useChat } from "../../../hooks/useChat";

const NavbarActions = ({
  toggleLanguage,
  language,
  isAuthenticated,
  user,
  logout,
  seller,
}: any) => {
  const [active, setActive] = useState<any>(null);

  const cart = useCartStore((state) => state.cart);
  const { notifications, notificationData = [] } = useNotification();
  const { favorites = [] } = useFavorite();

  const {
    unreadMessages: { data },
  } = useChat();

  return (
    <div className="flex items-center gap-6 text-(--foreground)">
      <button
        onClick={toggleLanguage}
        className="hover:text-orange-500 font-medium transition"
      >
        {language === "pl" ? "EN" : "PL"}
      </button>

      {user && (
        <div className=" relative">
          <Heart
            onMouseDown={(e) => {
              e.stopPropagation();
              setActive((prev: any) => (prev === "fav" ? null : "fav"));
            }}
            className="hover:text-orange-500 transition cursor-pointer"
          />
          <div className="absolute left-4 top-4 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[10px] text-white">
            {favorites.length}
          </div>
          {active === "fav" && (
            <FavoritesDropdown onClose={() => setActive(null)} />
          )}
        </div>
      )}

      {user && (
        <div className=" relative">
          <Link to="/chat">
            <MessageCircle className="hover:text-orange-500 transition cursor-pointer" />
            {data > 0 && (
              <div className="absolute left-4 top-4 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[10px] text-white">
                {data}
              </div>
            )}
          </Link>
        </div>
      )}

      {user && (
        <div className="relative">
          <Bell
            onMouseDown={(e) => {
              e.stopPropagation();

              setActive((prev: any) => (prev === "bell" ? null : "bell"));
            }}
            className="hover:text-orange-500 transition cursor-pointer"
          />
          {notificationData[0] && (
            <div className="absolute left-4 top-4 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[10px] text-white">
              {notificationData[1]}
            </div>
          )}

          {active === "bell" && (
            <BellDropdown
              notifications={notifications}
              onClose={() => setActive(null)}
            />
          )}
        </div>
      )}

      <div className="relative">
        <ShoppingCart
          onMouseDown={(e) => {
            e.stopPropagation();

            setActive((prev: any) => (prev === "cart" ? null : "cart"));
          }}
          className="cursor-pointer"
        />
        {cart.length > 0 && (
          <div className="absolute left-4 top-4 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[10px] text-white">
            {cart.length}
          </div>
        )}

        {active === "cart" && <CartDropdown onClose={() => setActive(null)} />}
      </div>

      <div className=" relative">
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            setActive((prev: any) => (prev === "account" ? null : "account"));
          }}
          className="hover:text-orange-500 flex items-center gap-3 transition cursor-pointer"
        >
          {isAuthenticated ? (
            <>
              <div className="lg:block hidden text-left">
                <p className="font-medium leading-none">
                  {user?.name} {user?.last_name}
                </p>

                <p className="mt-1 text-xs text-(--foreground-secondary)">
                  {user?.email}
                </p>
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
            <User size={22} />
          )}
        </button>

        {active === "account" && (
          <AccountDropdown
            isAuthenticated={isAuthenticated}
            user={user}
            logout={logout}
            onClose={() => setActive(null)}
            seller={seller}
          />
        )}
      </div>
    </div>
  );
};

export default NavbarActions;
