import { useCartStore } from "../../../zustand/states/cartState";

export default function OrderSummary() {
  const cart = useCartStore((state) => state.cart);

  const productsPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div
      className="
bg-white
shadow
p-6
sticky
top-5
"
    >
      <h2
        className="
font-bold
text-xl
mb-4
"
      >
        Podsumowanie
      </h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="
flex
justify-between
mb-2
"
        >
          <span>{item.product_data.name}</span>

          <span>
            {(item.price * item.quantity).toFixed(2)}
            zł
          </span>
        </div>
      ))}

      <hr className="my-4" />

      <div className="flex justify-between">
        <span>Produkty</span>

        <span>{productsPrice} zł</span>
      </div>

      <div
        className="
flex
justify-between
font-bold
text-lg
mt-3
"
      >
        <span>Razem</span>

        <span className="text-orange-500">{productsPrice} zł</span>
      </div>
    </div>
  );
}
