import { useCartStore } from "../../../zustand/states/cartState";
import { useNavigate } from "react-router-dom";

const CartDropdown = () => {
  const navigate = useNavigate();

  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();

  return (
    <div className=" top-10 w-125 absolute right-0 z-50 p-4 bg-white border border-gray-300 shadow-xl">
      <h2 className="mb-4 text-xl font-bold">Twój koszyk</h2>

      {cart.length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        <>
          <ul className="max-h-65 overflow-y-auto">
            {cart.map((item: any) => (
              <li
                key={item.id}
                className=" flex gap-3 pb-3 mb-3 border-b border-gray-300"
              >
                <img
                  src={
                    item.images?.[0]
                      ? `${import.meta.env.VITE_API_URL}uploads/products/${
                          item.seller_id
                        }/${item.id}/${item.images[0].image}`
                      : "/no-image.png"
                  }
                  className=" object-cover w-16 h-16"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>

                  <div>
                    <button
                      className="cursor-pointer"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>

                    <span className="px-2">{item.quantity}</span>

                    <button
                      className="cursor-pointer"
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

                <div>
                  <p className="font-bold">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="hover:underline text-xs text-red-500 cursor-pointer"
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/cart")}
            className=" w-full py-2 mt-3 text-white bg-orange-500 cursor-pointer"
          >
            Przejdź do koszyka
          </button>

          <button
            onClick={clearCart}
            className=" hover:underline w-full mt-2 text-red-500 cursor-pointer"
          >
            Wyczyść
          </button>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
