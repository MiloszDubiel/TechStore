import { useCheckout } from "../../../context/CheckoutContext";
import { useCartStore } from "../../../zustand/states/cartState";

const methods = {
  blik: "Kod BLIK",
  card: "Płatność kartą",
  transfer: "Przelew internetowy",
  cash: "Płatność przy odbiorze",
};

const SummaryStep = ({ back }: any) => {
  const { checkoutData } = useCheckout();
  const cartItems = useCartStore((state) => state.cart);

  const productsPrice = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const deliveryPrice = checkoutData.delivery?.price ?? 0;

  const totalPrice = productsPrice + deliveryPrice;

  const order = () => {
    console.log("Tworzenie zamówienia");

    console.log({
      ...checkoutData,
      products: cartItems,
      total: totalPrice,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Podsumowanie zamówienia</h2>

      <section className="mb-5">
        <h3 className="font-semibold text-lg mb-2">Dane klienta</h3>

        <p>
          {checkoutData.customer?.name} {checkoutData.customer?.last_name}
        </p>

        <p className="text-gray-600">{checkoutData.customer?.email}</p>
      </section>

      {/* Adres */}
      {checkoutData.delivery?.method === "courier" && (
        <section className="mb-5">
          <h3 className="font-semibold text-lg mb-2">Adres zamieszkania</h3>

          <p>{checkoutData.address?.street}</p>

          <p>
            {checkoutData.address?.postal_code} {checkoutData.address?.city}
          </p>
        </section>
      )}

      <section className="mb-5">
        <h3 className="font-semibold text-lg mb-2">Dostawa</h3>

        {checkoutData.delivery?.method === "courier" && (
          <p>
            Kurier DHL
            <strong> {checkoutData.delivery.price} zł</strong>
          </p>
        )}

        {checkoutData.delivery?.method === "locker" && (
          <div>
            <p>Paczkomat InPost</p>

            <p className="text-gray-600">
              {checkoutData.delivery.locker?.lockerName}
            </p>

            <p>{checkoutData.delivery.locker?.address}</p>
          </div>
        )}
      </section>

      <section className="mb-5">
        <h3 className="font-semibold text-lg mb-2">Płatność</h3>

        <p>{methods[checkoutData!.payment!.method || "blik"]}</p>
      </section>

      <hr className="my-5" />

      <div className="space-y-3">
        <p className="flex justify-between">
          <span>Produkty:</span>

          <strong>{productsPrice} zł</strong>
        </p>

        <p className="flex justify-between">
          <span>Dostawa:</span>

          <strong>{deliveryPrice} zł</strong>
        </p>

        <p className="flex justify-between text-xl font-bold">
          <span>Razem:</span>

          <span>{totalPrice} zł</span>
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={back}
          className="
            border
            border-gray-300
            px-6
            py-3
            cursor-pointer
          "
        >
          Wstecz
        </button>

        <button
          onClick={order}
          className="
            bg-orange-500
            text-white
            px-6
            py-3
            hover:bg-orange-600
            cursor-pointer
          "
        >
          Zamawiam
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;
