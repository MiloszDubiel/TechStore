import { useEffect, useState } from "react";
import ParcelLockerMap from "./ParcelLockerMap";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";
import { useCheckout } from "../../../zustand/states/checkOutStore";

const DeliveryStep = ({ next, back }: any) => {
  const checkoutData = useCheckout((state) => state.checkoutData);
  const updateCheckout = useCheckout((state) => state.setCheckoutData);
  const [method, setMethod] = useState(checkoutData?.delivery?.method ?? "");

  useEffect(() => {
    updateCheckout({
      delivery: {
        method: "courier",
        price: 15,
        locker: null,
      },
    });
  }, []);

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold">Metoda dostawy</h2>

      <label className="mb-3 block cursor-pointer border border-gray-200 p-4">
        <input
          type="radio"
          name="delivery"
          checked={method === "courier"}
          onChange={() => {
            setMethod("courier");

            updateCheckout({
              delivery: {
                method: "courier",
                price: 15,
                locker: null,
              },
            });
          }}
        />

        <span className="ml-3">Kurier DHL - 15 zł</span>
      </label>

      <label className="block cursor-pointer border border-gray-200 p-4">
        <input
          type="radio"
          name="delivery"
          checked={method === "locker"}
          onChange={() => {
            setMethod("locker");

            updateCheckout({
              delivery: {
                ...checkoutData.delivery,
                method: "locker",
                price: 12,
              },
            });
          }}
        />

        <span className="ml-3">Paczkomat InPost - 12 zł</span>
      </label>

      {method === "locker" && <ParcelLockerMap />}

      <div className="mt-8 flex justify-between">
        <GrayButton onClick={back}>Wstecz</GrayButton>

        <OrangeButton disabled={!method || (method === "locker" && !checkoutData.delivery?.locker)} onClick={next}>
          Dalej
        </OrangeButton>
      </div>
    </div>
  );
};
export default DeliveryStep;
