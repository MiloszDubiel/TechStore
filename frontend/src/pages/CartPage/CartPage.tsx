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
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),

    [cart],
  );

  return (
    <>
      <Navbar />

      <section className="bg-orange-500 py-16 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Twój koszyk</h1>

        <p>Sprawdź produkty przed zakupem</p>
      </section>

      <main className="container mx-auto grid grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.length === 0 && <p className="text-(--foreground-secondary)">Koszyk jest pusty</p>}

          {cart.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 border border-(--border) bg-(--surface) p-4 shadow-sm">
              <img src={useImage(item) || "/no-image.png"} className="h-24 w-24 object-cover" alt={item.name} />

              <div className="flex-1">
                <h3 className="font-semibold text-(--foreground)">{item.name}</h3>

                <p className="text-(--foreground-secondary)">Ilość: {item.quantity}</p>

                <p className="text-(--foreground)">{item.price} zł / szt.</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-orange-500">{(item.price * item.quantity).toFixed(2)} zł</p>

                <button onClick={() => removeFromCart(item.id)} className="cursor-pointer text-sm text-red-500 hover:underline">
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit border border-(--border) bg-(--surface) p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-(--foreground)">Podsumowanie</h2>

          <div className="mb-3 flex justify-between text-(--foreground)">
            <span>Produkty</span>

            <span>{totalPrice} zł</span>
          </div>

          <div className="mb-3 flex justify-between text-(--foreground)">
            <span>Dostawa</span>

            <span className="text-(--foreground-secondary)">zostanie wybrana później</span>
          </div>

          <hr className="my-4 border-(--border)" />

          <div className="flex justify-between text-xl font-bold text-(--foreground)">
            <span>Razem</span>

            <span className="text-orange-500">{totalPrice} zł</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => navigate("/cart/checkout")}
            className="mt-6 w-full cursor-pointer bg-orange-500 py-3 text-white transition hover:bg-orange-600 disabled:bg-gray-300"
          >
            Przejdź do kasy
          </button>

          <button onClick={clearCart} className="mt-3 w-full cursor-pointer text-red-500 hover:underline">
            Wyczyść koszyk
          </button>
        </div>
      </main>
    </>
  );
};
export default CartPage;
