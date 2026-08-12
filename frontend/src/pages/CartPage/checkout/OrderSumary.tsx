import { useCartStore } from "../../../zustand/states/cartState";

export default function OrderSummary() {
  const cart = useCartStore((state) => state.cart);

  const productsPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="sticky top-5 border border-(--border) bg-(--surface) p-6 text-(--foreground) shadow">
      <h2 className="mb-4 text-xl font-bold">Podsumowanie</h2>

      {cart.map((item) => (
        <div key={item.id} className="mb-2 flex min-w-0 justify-between gap-2 text-(--foreground-secondary)">
          <span className="min-w-0 truncate">{item.name}</span>

          <span className="shrink-0 text-(--foreground)">{(item.price * item.quantity).toFixed(2)} zł</span>
        </div>
      ))}

      <hr className="my-4 border-(--border)" />

      <div className="flex justify-between text-(--foreground)">
        <span>Produkty</span>

        <span>{productsPrice} zł</span>
      </div>

      <div className="mt-3 flex justify-between text-lg font-bold">
        <span>Razem</span>

        <span className="text-orange-500">{productsPrice} zł</span>
      </div>
    </div>
  );
}
