import {
  Heart,
  ShoppingCart,
  Bell,
  MessageCircle,
  User,
  Menu,
} from "lucide-react";

import { useRef, useState } from "react";
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
    <div className="shrink-0 flex items-center gap-6">
      <Menu
        className="md:hidden block cursor-pointer"
        onClick={() => {
          setHidden((prev) => !prev);
        }}
      />

      <div
        className={`
    ${hidden ? "hidden" : "flex"}
    md:flex!
    md:gap-4
    md:static
    md:justify-start
    md:border-0
    md:bg-transparent
    absolute
    h-20
    left-0
    top-18
    flex
    w-full
    items-center
    justify-around
    gap-6
    border
    border-(--border)
    border-0.5
    bg-(--surface)
  `}
      >
        {user && (
          <div className="shrink-0 relative flex flex-col items-center justify-center">
            <Heart
              size={20}
              onMouseDown={(e) => {
                e.stopPropagation();
                setActive((prev: any) => (prev === "fav" ? null : "fav"));
              }}
              className="hover:text-orange-500 transition-colors cursor-pointer"
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
              <div
                className="
              absolute -right-2 -top-2
              grid h-4 w-4
              place-content-center
              rounded-full
              bg-orange-500
              text-[9px]
              font-medium
              text-white
            "
              >
                {favorites.length}
              </div>
            )}

            {active === "fav" && (
              <FavoritesDropdown onClose={() => setActive(null)} />
            )}
          </div>
        )}

        {user && (
          <div className="shrink-0 f relative">
            <Link
              to="/chat"
              className="flex flex-col items-center justify-center"
            >
              <MessageCircle
                size={20}
                className="hover:text-orange-500 transition-colors cursor-pointer"
              />
              <span className="md:hidden">Wiadomości</span>

              {data > 0 && (
                <div
                  className="
                absolute -right-2 -top-2
                grid h-4 w-4
                place-content-center
                rounded-full
                bg-orange-500
                text-[9px]
                font-medium
                text-white
              "
                >
                  {data}
                </div>
              )}
            </Link>
          </div>
        )}

        {user && (
          <div className="shrink-0 relative flex flex-col items-center justify-center">
            <Bell
              size={20}
              onMouseDown={(e) => {
                e.stopPropagation();
                setActive((prev: any) => (prev === "bell" ? null : "bell"));
              }}
              className="hover:text-orange-500 transition-colors cursor-pointer"
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
              <div
                className="
              absolute -right-2 -top-2
              grid h-4 w-4
              place-content-center
              rounded-full
              bg-orange-500
              text-[9px]
              font-medium
              text-white
            "
              >
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

        <div className="shrink-0 relative flex flex-col items-center justify-center">
          <ShoppingCart
            size={20}
            onMouseDown={(e) => {
              e.stopPropagation();
              setActive((prev: any) => (prev === "cart" ? null : "cart"));
            }}
            className="hover:text-orange-500 transition-colors cursor-pointer"
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
            <div
              className="
            absolute -right-2 -top-2
            grid h-4 w-4
            place-content-center
            rounded-full
            bg-orange-500
            text-[9px]
            font-medium
            text-white
          "
            >
              {cart.length}
            </div>
          )}

          {active === "cart" && (
            <CartDropdown onClose={() => setActive(null)} />
          )}
        </div>
      </div>
      <div className="shrink-0 relative">
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            setActive((prev: any) => (prev === "account" ? null : "account"));
          }}
          className=" hover:text-orange-500 flex items-center gap-2 transition-colors cursor-pointer"
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

              <div className=" h-9 w-9 shrink-0 flex items-center justify-center text-sm font-semibold text-white bg-orange-500 rounded-full">
                {user?.name?.[0]}
                {user?.last_name?.[0]}

                {!user?.name?.[0] && !user?.last_name?.[0] && (
                  <User size={20} />
                )}
              </div>
            </>
          ) : (
            <User size={20} />
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
