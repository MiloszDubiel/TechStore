import { useState } from "react";

import CheckoutSteps from "./CheckoutSteps";
import OrderSummary from "./OrderSumary";
import CustomerStep from "./CustomerStep";
import AddressStep from "./AddressStep";
import DeliveryStep from "./DeliveryStep";
import PaymentStep from "./PaymentStep";
import SummaryStep from "./SummaryStep";
import { useCheckout } from "../../../context/CheckoutContext";
import Navbar from "../../../components/layout/Navbar";
import OrderSuccess from "./OrderSuccess";

export default function CheckoutLayout() {
  const { checkoutData } = useCheckout();

  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  const steps =
    checkoutData.delivery?.method === "locker"
      ? ["Dane", "Dostawa", "Płatność", "Podsumowanie", "Sukces"]
      : ["Dane", "Dostawa", "Adres", "Płatność", "Podsumowanie", "Sukces"];

  const next = () => {
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    if (checkoutData.delivery?.method === "locker") {
      switch (step) {
        case 0:
          return <CustomerStep next={next} />;

        case 1:
          return <DeliveryStep next={next} back={back} />;

        case 2:
          return <PaymentStep next={next} back={back} />;

        case 3:
          return (
            <SummaryStep
              back={back}
              onSuccess={(id: string) => {
                setOrderId(id);
                next();
              }}
            />
          );

        case 4:
          return <OrderSuccess orderId={orderId} />;

        default:
          return null;
      }
    }

    switch (step) {
      case 0:
        return <CustomerStep next={next} />;

      case 1:
        return <DeliveryStep next={next} back={back} />;

      case 2:
        return <AddressStep next={next} back={back} />;

      case 3:
        return <PaymentStep next={next} back={back} />;

      case 4:
        return (
          <SummaryStep
            back={back}
            onSuccess={(id: string) => {
              setOrderId(id);
              next();
            }}
          />
        );

      case 5:
        return <OrderSuccess orderId={orderId} />;

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container px-6 py-10 mx-auto">
        <CheckoutSteps steps={steps} current={step} />

        <div className=" lg:grid-cols-3 grid grid-cols-1 gap-8 mt-10">
          <div
            className="
          lg:col-span-2
          bg-white
          p-6
          shadow
          "
          >
            {renderStep()}
          </div>

          <div className="lg:order-last order-first">
            <OrderSummary />
          </div>
        </div>
      </div>
    </>
  );
}
