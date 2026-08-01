import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";
import { useCheckout } from "../../../context/CheckoutContext";
import { useState } from "react";

const PaymentStep = ({ next, back }: any) => {
  const { updateCheckout, checkoutData } = useCheckout();

  const payments = [
    {
      id: "blik",
      name: "BLIK",
      description: "Szybka płatność kodem BLIK",
    },
    {
      id: "card",
      name: "Karta płatnicza",
      description: "Visa / Mastercard",
    },
    {
      id: "transfer",
      name: "Przelew tradycyjny",
      description: "Przelew bankowy",
    },
    checkoutData.delivery.method !== "locker"
      ? {
          id: "cash_on_delivery",
          name: "Płatność przy odbiorze",
          description: "Zapłacisz kurierowi",
        }
      : null,
  ].filter(Boolean);

  const [selectedPayment, setSelectedPayment] = useState(
    checkoutData.payment?.method ?? null
  );

  const selectPayment = (method: any) => {
    setSelectedPayment(method);

    updateCheckout({
      payment: {
        method,
      },
    });
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Metoda płatności</h2>

      <div className="space-y-4">
        {payments.map((payment) => (
          <label
            key={payment?.id}
            className={`
              block
              border
              p-4
              cursor-pointer
              transition
              ${
                selectedPayment === payment?.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200"
              }
            `}
          >
            <div className="flex gap-3">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === payment?.id}
                onChange={() => selectPayment(payment?.id)}
              />

              <div>
                <p className="font-semibold">{payment?.name}</p>

                <p className="text-sm text-gray-500">{payment?.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <GrayButton onClick={back}>Wstecz</GrayButton>
        <OrangeButton disabled={!selectedPayment} onClick={next}>
          Dalej
        </OrangeButton>
      </div>
    </div>
  );
};

export default PaymentStep;
