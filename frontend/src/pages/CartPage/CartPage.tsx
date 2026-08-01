import { useMemo } from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useCartStore } from "../../zustand/states/cartState";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../hooks/useImage";

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

    [cart]
  );

  console.log(cart);

  return (
    <>
      <Navbar />

      <section className="py-16 text-center text-white bg-orange-500">
        <h1 className="mb-4 text-4xl font-bold">Twój koszyk</h1>

        <p>Sprawdź produkty przed zakupem</p>
      </section>

      <main className="lg:grid-cols-3 container grid grid-cols-1 gap-8 px-6 py-12 mx-auto">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 && (
            <p className="text-gray-500">Koszyk jest pusty</p>
          )}

          {cart.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white shadow-md"
            >
              <img
                src={useImage(item) || "/no-image.png"}
                className="object-cover w-24 h-24"
                alt={item.name}
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>

                <p className="text-gray-500">Ilość: {item.quantity}</p>

                <p>{item.price} zł / szt.</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-orange-500">
                  {(item.price * item.quantity).toFixed(2)} zł
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="hover:underline text-sm text-red-500"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit p-6 bg-white shadow-md">
          <h2 className="mb-6 text-xl font-bold">Podsumowanie</h2>

          <div className="flex justify-between mb-3">
            <span>Produkty</span>

            <span>{totalPrice} zł</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Dostawa</span>

            <span>zostanie wybrana później</span>
          </div>

          <hr className="my-4 text-gray-300" />

          <div className="flex justify-between text-xl font-bold">
            <span>Razem</span>

            <span className="text-orange-500">{totalPrice} zł</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => navigate("/cart/checkout")}
            className=" hover:bg-orange-600 disabled:bg-gray-300 w-full py-3 mt-6 text-white bg-orange-500"
          >
            Przejdź do kasy
          </button>

          <button
            onClick={clearCart}
            className=" hover:underline w-full mt-3 text-red-500 cursor-pointer"
          >
            Wyczyść koszyk
          </button>
        </div>
      </main>
    </>
  );
};
export default CartPage;
