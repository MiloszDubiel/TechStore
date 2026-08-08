import { Heart, ShoppingCart, Bell, MessageCircle, User, Menu, SearchIcon } from "lucide-react";

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

const NavbarActions = ({ isAuthenticated, user, logout, seller }: any) => {
  const [active, setActive] = useState<any>(null);

  const cart = useCartStore((state) => state.cart);
  const { notifications, notificationData = [] } = useNotification();
  const { favorites = [] } = useFavorite();

  const {
    unreadMessages: { data },
  } = useChat();

  const [hidden, setHidden] = useState<boolean>(true);

  return (
    <>
      <div className="flex shrink-0 items-center gap-6">
        <Menu
          className="block cursor-pointer md:hidden"
          onClick={() => {
            setHidden((prev) => !prev);
          }}
        />

        <div
          className={` ${hidden ? "hidden" : "flex"} border-0.5 absolute top-18 left-0 flex h-20 w-full items-center justify-around gap-6 border border-(--border) bg-(--surface) md:static md:flex! md:justify-start md:gap-4 md:border-0 md:bg-transparent`}
        >
          {user && (
            <div className="relative flex shrink-0 flex-col items-center justify-center">
              <Heart
                size={20}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActive((prev: any) => (prev === "fav" ? null : "fav"));
                }}
                className="cursor-pointer transition-colors hover:text-orange-500"
              />
              <span
                className="md:hidden"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActive((prev: any) => (prev === "fav" ? null : "fav"));
                }}
              >
                Ulubione
              </span>

              {favorites.length > 0 && (
                <div className="absolute -top-2 -right-2 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[9px] font-medium text-white">
                  {favorites.length}
                </div>
              )}

              {active === "fav" && <FavoritesDropdown onClose={() => setActive(null)} />}
            </div>
          )}

          {user && (
            <div className="f relative shrink-0">
              <Link to="/chat" className="flex flex-col items-center justify-center">
                <MessageCircle size={20} className="cursor-pointer transition-colors hover:text-orange-500" />
                <span className="md:hidden">Wiadomości</span>

                {data > 0 && (
                  <div className="absolute -top-2 -right-2 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[9px] font-medium text-white">
                    {data}
                  </div>
                )}
              </Link>
            </div>
          )}

          {user && (
            <div className="relative flex shrink-0 flex-col items-center justify-center">
              <Bell
                size={20}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActive((prev: any) => (prev === "bell" ? null : "bell"));
                }}
                className="cursor-pointer transition-colors hover:text-orange-500"
              />
              <span
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActive((prev: any) => (prev === "bell" ? null : "bell"));
                }}
                className="md:hidden"
              >
                Koszyk
              </span>

              {notificationData[0] && (
                <div className="absolute -top-2 -right-2 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[9px] font-medium text-white">
                  {notificationData[1]}
                </div>
              )}

              {active === "bell" && <BellDropdown notifications={notifications} onClose={() => setActive(null)} />}
            </div>
          )}

          <div className="relative flex shrink-0 flex-col items-center justify-center">
            <ShoppingCart
              size={20}
              onMouseDown={(e) => {
                e.stopPropagation();
                setActive((prev: any) => (prev === "cart" ? null : "cart"));
              }}
              className="cursor-pointer transition-colors hover:text-orange-500"
            />
            <span
              onMouseDown={(e) => {
                e.stopPropagation();
                setActive((prev: any) => (prev === "cart" ? null : "cart"));
              }}
              className="md:hidden"
            >
              Koszyk
            </span>

            {cart.length > 0 && (
              <div className="absolute -top-2 -right-2 grid h-4 w-4 place-content-center rounded-full bg-orange-500 text-[9px] font-medium text-white">
                {cart.length}
              </div>
            )}

            {active === "cart" && <CartDropdown onClose={() => setActive(null)} />}
          </div>
        </div>
        <div className="relative shrink-0">
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              setActive((prev: any) => (prev === "account" ? null : "account"));
            }}
            className="flex cursor-pointer items-center gap-2 transition-colors hover:text-orange-500"
          >
            {isAuthenticated ? (
              <>
                <div className="hidden text-left lg:block">
                  <p className="leading-none font-medium">
                    {user?.name} {user?.last_name}
                  </p>

                  <p className="mt-1 text-xs text-(--foreground-secondary)">{user?.email}</p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                  {user?.name?.[0]}
                  {user?.last_name?.[0]}

                  {!user?.name?.[0] && !user?.last_name?.[0] && <User size={20} />}
                </div>
              </>
            ) : (
              <User size={20} />
            )}
          </button>
        </div>
      </div>
      {active === "account" && (
        <AccountDropdown isAuthenticated={isAuthenticated} user={user} logout={logout} onClose={() => setActive(null)} seller={seller} />
      )}
    </>
  );
};
export default NavbarActions;
