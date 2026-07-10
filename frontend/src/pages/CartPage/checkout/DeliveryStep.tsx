import { useEffect, useState } from "react";
import ParcelLockerMap from "./ParcelLockerMap";
import { useCheckout } from "../../../context/CheckoutContext";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";

const DeliveryStep = ({ next, back }: any) => {
  const { updateCheckout, checkoutData } = useCheckout();

  const [method, setMethod] = useState(checkoutData.delivery?.method ?? "");

  const selectCourier = () => {
    setMethod("courier");

    updateCheckout({
      delivery: {
        method: "courier",
        price: 15,
      },
    });
  };

  const selectLocker = () => {
    setMethod("locker");

    updateCheckout({
      delivery: {
        method: "locker",
        price: 12,
        locker: undefined,
      },
    });
  };

  useEffect(() => {
    updateCheckout({
      delivery: {
        method: "courier",
        price: 15,
        locker: undefined,
      },
    });
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Metoda dostawy</h2>

      <label
        className="
          border 
          border-gray-200 
          p-4 
          block 
          mb-3 
          cursor-pointer
        "
      >
        <input
          type="radio"
          name="delivery"
          checked={method === "courier"}
          onChange={selectCourier}
        />

        <span className="ml-3">Kurier DHL - 15 zł</span>
      </label>

      <label
        className="
          border 
          border-gray-200 
          p-4 
          block 
          cursor-pointer
        "
      >
        <input
          type="radio"
          name="delivery"
          checked={method === "locker"}
          onChange={selectLocker}
        />

        <span className="ml-3">Paczkomat InPost - 12 zł</span>
      </label>

      {method === "locker" && <ParcelLockerMap />}

      <div className="flex justify-between mt-8">
        <GrayButton onClick={back}>Wstecz</GrayButton>
        <OrangeButton
          disabled={
            !method || (method === "locker" && !checkoutData.delivery?.locker)
          }
          onClick={next}
        >
          {" "}
          Dalej
        </OrangeButton>
      </div>
    </div>
  );
};

export default DeliveryStep;
