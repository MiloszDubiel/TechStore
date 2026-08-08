import { useMutation } from "@tanstack/react-query";
import { GrayButton } from "../../../components/ui/Buttons";
import { useCheckout } from "../../../context/CheckoutContext";
import { useCartStore } from "../../../zustand/states/cartState";
import { useState } from "react";
import { api } from "../../../axios";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const methods = {
  blik: "Kod BLIK",
  card: "Płatność kartą",
  transfer: "Przelew internetowy",
  cash: "Płatność przy odbiorze",
};

const SummaryStep = ({ back, onSuccess }: any) => {
  const { checkoutData, setIsComplete } = useCheckout();
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user } = useAuth();
  const [orderCompleted] = useState(false);

  const productsPrice = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const deliveryPrice = checkoutData.delivery?.price ?? 0;

  const totalPrice = productsPrice + deliveryPrice;

  const order = () => {
    if (orderCompleted) {
      return;
    }

    let user_id = user?.id || null;
    if (checkoutData.customer?.email != user?.email) user_id = null;

    mutate({
      ...checkoutData,

      products: cartItems,

      total: totalPrice,
      user_id: user?.id,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => api.post("/api/products/products/order", data),

    onSuccess: (response) => {
      clearCart();

      setIsComplete(true);

      toast.success("Zamówienie złożone");
      onSuccess(response.data.orderNumber);
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Nie udało się utworzyć zamówienia");
    },
  });

  return (
    <div>
      <section className="mb-5">
        <h3 className="mb-2 text-lg font-semibold">Dane klienta</h3>

        <p>
          {checkoutData.customer?.name} {checkoutData.customer?.last_name}
        </p>

        <p className="text-gray-600">{checkoutData.customer?.email}</p>
      </section>

      {checkoutData.delivery?.method === "courier" && (
        <section className="mb-5">
          <h3 className="mb-2 text-lg font-semibold">Adres zamieszkania</h3>

          <p>{checkoutData.address?.street}</p>

          <p>
            {checkoutData.address?.postal_code} {checkoutData.address?.city}
          </p>
        </section>
      )}

      <section className="mb-5">
        <h3 className="mb-2 text-lg font-semibold">Dostawa</h3>

        {checkoutData.delivery?.method === "courier" && (
          <p>
            Kurier DHL
            <strong> {checkoutData.delivery.price} zł</strong>
          </p>
        )}

        {checkoutData.delivery?.method === "locker" && (
          <div>
            <p>Paczkomat InPost</p>

            <p className="text-gray-600">{checkoutData.delivery.locker?.name}</p>

            <p>{checkoutData.delivery.locker?.address}</p>
          </div>
        )}
      </section>

      <section className="mb-5">
        <h3 className="mb-2 text-lg font-semibold">Płatność</h3>

        <p>{methods[checkoutData!.payment!.method || "blik"]}</p>
      </section>

      <hr className="my-5 text-gray-300" />

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
        <div className="mt-8 flex justify-between">
          <GrayButton onClick={back}>Wstecz</GrayButton>

          <button
            onClick={order}
            disabled={isPending}
            className="cursor-pointer bg-orange-500 px-6 py-3 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isPending ? "Tworzenie zamówienia..." : "Zamawiam"}
          </button>
        </div>
      )}
    </div>
  );
};
export default SummaryStep;
