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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
      className="fixed top-0 right-0 left-0 z-50 h-full w-full border border-(--border) bg-(--surface) p-4 text-(--foreground) shadow-xl md:absolute md:inset-auto md:top-10 md:right-0 md:h-auto md:w-125"
    >
      <div className="flex w-full justify-end md:hidden">
        <X onClick={onClose} className="cursor-pointer" />
      </div>
      <h2 className="mb-4 text-xl font-bold">Twój koszyk</h2>

      {cart.length === 0 ? (
        <p className="text-(--foreground-secondary)">Koszyk jest pusty</p>
      ) : (
        <>
          <ul className="max-h-65 overflow-y-auto">
            {cart.map((item: any) => (
              <li key={item.id} className="mb-3 flex gap-3 border-b border-(--border) pb-3">
                <img src={useImage(item)} className="h-16 w-16 bg-(--surface-secondary) object-cover" alt={item.name} />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>

                  <div className="mt-1 flex items-center">
                    <button
                      className="cursor-pointer text-lg transition hover:text-orange-500"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>

                    <span className="px-3 text-sm">{item.quantity}</span>

                    <button
                      className="cursor-pointer text-lg transition hover:text-orange-500"
                      onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">{(item.price * item.quantity).toFixed(2)} zł</p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cursor-pointer text-xs text-red-500 transition hover:text-red-400"
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/cart")}
            className="mt-3 w-full cursor-pointer bg-orange-500 py-2 text-white transition hover:bg-orange-600"
          >
            Przejdź do koszyka
          </button>

          <button onClick={clearCart} className="mt-2 w-full cursor-pointer text-red-500 transition hover:text-red-400">
            Wyczyść
          </button>
        </>
      )}
    </div>
  );
};
export default CartDropdown;
