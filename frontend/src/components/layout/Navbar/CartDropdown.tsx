import { useCartStore } from "../../../zustand/states/cartState";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useImage } from "../../../hooks/useImage";
import { X } from "lucide-react";

const CartDropdown = ({ onClose }: any) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="
        md:absolute right-0  z-50 md:w-125
        border border-(--border)
        bg-(--surface)
        p-4
        text-(--foreground)
        shadow-xl
        fixed
        top-0
        left-0
        w-full
        h-full
        md:h-auto
  md:inset-auto
  md:right-0
  md:top-10
      "
    >
      <div className="md:hidden flex justify-end w-full">
        <X onClick={onClose} className="cursor-pointer" />
      </div>
      <h2 className="mb-4 text-xl font-bold">Twój koszyk</h2>

      {cart.length === 0 ? (
        <p className="text-(--foreground-secondary)">Koszyk jest pusty</p>
      ) : (
        <>
          <ul className="max-h-65 overflow-y-auto">
            {cart.map((item: any) => (
              <li
                key={item.id}
                className="
                  mb-3 flex gap-3 border-b
                  border-(--border) pb-3
                "
              >
                <img
                  src={useImage(item)}
                  className="
                    h-16 w-16
                    object-cover
                    bg-(--surface-secondary)
                  "
                  alt={item.name}
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>

                  <div className="flex items-center mt-1">
                    <button
                      className=" hover:text-orange-500 text-lg transition cursor-pointer"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>

                    <span className="px-3 text-sm">{item.quantity}</span>

                    <button
                      className=" hover:text-orange-500 text-lg transition cursor-pointer"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.min(item.stock, item.quantity + 1)
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className=" hover:text-red-400 text-xs text-red-500 transition cursor-pointer"
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/cart")}
            className=" hover:bg-orange-600 w-full py-2 mt-3 text-white transition bg-orange-500 cursor-pointer"
          >
            Przejdź do koszyka
          </button>

          <button
            onClick={clearCart}
            className=" hover:text-red-400 w-full mt-2 text-red-500 transition cursor-pointer"
          >
            Wyczyść
          </button>
        </>
      )}
    </div>
  );
};
export default CartDropdown;
