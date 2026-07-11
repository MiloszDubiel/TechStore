import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAdresses from "../../../hooks/useAdresses";
import AddressModal from "../../../components/ui/AddressModal";
import { useCheckout } from "../../../context/CheckoutContext";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";

type Props = {
  next: () => void;
  back: () => void;
};

export default function AddressStep({ next, back }: Props) {
  const { user } = useAuth();

  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");

  const { userAddresses, saveAddress } = useAdresses(user?.id, token);

  const { updateCheckout } = useCheckout();

  const [closeModal, setCloseModal] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (userAddresses && userAddresses.length > 0 && !selectedAddressId) {
      const defaultAddress =
        userAddresses.find((a: any) => a.is_default) ?? userAddresses[0];

      setSelectedAddressId(defaultAddress.id);

      updateCheckout({
        address: defaultAddress,
      });
    }
  }, [userAddresses]);

  const currentAddress = userAddresses?.find(
    (address: any) => address.id === selectedAddressId,
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Adres zamieszkania</h2>

      {currentAddress ? (
        <div className="space-y-6 mb-4">
          <div
            className="
        border
        border-gray-200
        p-5
        bg-gray-50
      "
          >
            <h2 className="font-semibold mb-3">Dane do zamówienia</h2>

            <p className="font-medium">{currentAddress.street}</p>

            <p className="text-gray-500">
              {currentAddress.postal_code} {currentAddress.city}
            </p>

            {currentAddress.country && (
              <p className="text-gray-500">{currentAddress.country}</p>
            )}
          </div>
        </div>
      ) : (
        <div
          className="
      border
      border-gray-200
      p-5
      bg-gray-50
    "
        >
          Nie wybrano adresu
        </div>
      )}

      {userAddresses && userAddresses.length > 0 ? (
        <div className="space-y-4">
          {userAddresses.map((address: any) => (
            <label
              key={address.id}
              className={`flex items-start gap-4 border border-gray-200 p-4 cursor-pointer hover:border-orange-500 transition
              
              ${
                selectedAddressId === address.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === address.id}
                onChange={() => {
                  setSelectedAddressId(address.id);

                  updateCheckout({
                    address,
                  });
                }}
                className="mt-1"
              />

              <div>
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">{address.street}</p>

                  {address.is_default && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Domyślny
                    </span>
                  )}
                </div>

                <p className="text-gray-600">
                  {address.postal_code} {address.city}
                </p>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 p-6 text-center text-gray-500">
          Nie masz zapisanych adresów.
        </div>
      )}

      <button
        type="button"
        className="mt-6 border border-orange-500 text-orange-500 px-5 py-3 hover:bg-orange-50 transition cursor-pointer"
        onClick={() => setCloseModal(true)}
      >
        + Dodaj nowy adres
      </button>

      <div className="flex justify-between mt-8">
        <GrayButton onClick={back}>Wstecz</GrayButton>

        <OrangeButton onClick={next} disabled={!selectedAddressId}>
          Dalej
        </OrangeButton>
      </div>

      {closeModal && (
        <AddressModal
          closeModal={() => setCloseModal(false)}
          saveAddress={(data) => {
            saveAddress(data, {
              onSuccess: (response) => {
                const newAddress = response.data.address;
                setSelectedAddressId(newAddress.id);

                updateCheckout({
                  address: newAddress,
                });

                setCloseModal(false);
              },
            });
          }}
          defaultValues={{
            city: "",
            postal_code: "",
            street: "",
            is_default: false,
          }}
          isEdited={false}
          updateAddress={() => {}}
        />
      )}
    </div>
  );
}
