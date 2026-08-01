import { useCartStore } from "../../../zustand/states/cartState";

export default function OrderSummary() {
  const cart = useCartStore((state) => state.cart);

  const productsPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className=" top-5 sticky p-6 bg-white shadow">
      <h2 className=" mb-4 text-xl font-bold">Podsumowanie</h2>

      {cart.map((item) => (
        <div key={item.id} className=" flex justify-between mb-2">
          <span>{item.name}</span>

          <span>
            {(item.price * item.quantity).toFixed(2)}
            zł
          </span>
        </div>
      ))}

      <hr className="my-4 text-gray-300" />

      <div className="flex justify-between">
        <span>Produkty</span>

        <span>{productsPrice} zł</span>
      </div>

      <div className=" flex justify-between mt-3 text-lg font-bold">
        <span>Razem</span>

        <span className="text-orange-500">{productsPrice} zł</span>
      </div>
    </div>
  );
}
