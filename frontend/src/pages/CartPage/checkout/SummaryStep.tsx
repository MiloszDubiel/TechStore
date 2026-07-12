import { useMutation } from "@tanstack/react-query";
import { GrayButton } from "../../../components/ui/Buttons";
import { useCheckout } from "../../../context/CheckoutContext";
import { useCartStore } from "../../../zustand/states/cartState";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../../../components/ui/NotificationCard";
const methods = {
  blik: "Kod BLIK",
  card: "Płatność kartą",
  transfer: "Przelew internetowy",
  cash: "Płatność przy odbiorze",
};

const SummaryStep = ({ back }: any) => {
  const { checkoutData } = useCheckout();
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { token } = useAuth();
  const [orderCompleted, setOrderCompleted] = useState(false);

  const productsPrice = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const deliveryPrice = checkoutData.delivery?.price ?? 0;

  const totalPrice = productsPrice + deliveryPrice;

  const order = () => {
    if (orderCompleted) {
      return;
    }

    mutate({
      ...checkoutData,

      products: cartItems,

      total: totalPrice,
    });
  };

  const { mutate, isSuccess } = useMutation({
    mutationFn: (data: any) =>
      axios.post("/api/products/products/order", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

    onSuccess: (response) => {
      console.log("Zamówienie utworzone", response.data);

      clearCart();

      setOrderCompleted(true);

      alert(
        `Zamówienie zostało utworzone! Numer zamówienia: ${response.data.orderId}`,
      );
    },

    onError: (error: any) => {
      alert(
        error.response?.data?.message ?? "Nie udało się utworzyć zamówienia",
      );
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Podsumowanie zamówienia</h2>
      {isSuccess && <NotificationCard message={"Zamówienie złożone"} />}
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
              {checkoutData.delivery.locker?.name}
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

      {!orderCompleted && (
        <div className="flex justify-between mt-8">
          && <GrayButton onClick={back}> Wstecz</GrayButton>
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
      )}
    </div>
  );
};

export default SummaryStep;
