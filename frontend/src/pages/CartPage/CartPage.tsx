import { useMemo } from "react";
import Navbar from "../../components/layout/Navbar";
import { useCartStore } from "../../zustand/states/cartState";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const navigate = useNavigate();

  const totalPrice = useMemo(
    () =>
      cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2),

    [cart],
  );

  return (
    <>
      <Navbar />

      <section className="bg-orange-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Twój koszyk</h1>

        <p>Sprawdź produkty przed zakupem</p>
      </section>

      <main className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 && (
            <p className="text-gray-500">Koszyk jest pusty</p>
          )}

          {cart.map((item: any) => (
            <div
              key={item.id}
              className="
                bg-white
                shadow-md
                p-4
                flex
                gap-4
                items-center
                "
            >
              <img
                src={item.product_data.images?.[0]?.url || "/no-image.png"}
                className="
                  w-24
                  h-24
                  object-cover
                  "
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.product_data.name}</h3>

                <p className="text-gray-500">Ilość: {item.quantity}</p>

                <p>{item.price} zł / szt.</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-orange-500">
                  {(item.price * item.quantity).toFixed(2)} zł
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="
                    text-red-500
                    text-sm
                    hover:underline
                    "
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PODSUMOWANIE */}

        <div
          className="
          bg-white
          shadow-md
          p-6
          h-fit
          "
        >
          <h2 className="text-xl font-bold mb-6">Podsumowanie</h2>

          <div className="flex justify-between mb-3">
            <span>Produkty</span>

            <span>{totalPrice} zł</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Dostawa</span>

            <span>zostanie wybrana później</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold">
            <span>Razem</span>

            <span className="text-orange-500">{totalPrice} zł</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => {
              navigate("/cart/checkout");
            }}
            className="
            w-full
            mt-6
            bg-orange-500
            text-white
            py-3
            hover:bg-orange-600
            disabled:bg-gray-300
            "
          >
            Przejdź do kasy
          </button>

          <button
            onClick={clearCart}
            className="
            w-full
            mt-3
            text-red-500
            hover:underline
            "
          >
            Wyczyść koszyk
          </button>
        </div>
      </main>
    </>
  );
};

export default CartPage;
