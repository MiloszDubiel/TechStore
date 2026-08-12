import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAdresses from "../../../hooks/useAdresses";
import AddressModal from "../../../components/ui/AddressModal";
import { useCheckout } from "../../../zustand/states/checkOutStore";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";

type Props = {
  next: () => void;
  back: () => void;
};

export default function AddressStep({ next, back }: Props) {
  const { user } = useAuth();
  const [guestAddress, setGuestAddress] = useState<any | null>(null);
  const { userAddresses, saveAddress } = useAdresses(user?.id);

  const updateCheckout = useCheckout((state) => state.setCheckoutData);

  const [closeModal, setCloseModal] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (userAddresses && userAddresses.length > 0 && !selectedAddressId) {
      const defaultAddress = userAddresses.find((a: any) => a.is_default) ?? userAddresses[0];

      setSelectedAddressId(defaultAddress.id);

      updateCheckout({
        address: defaultAddress,
      });
    }
  }, [userAddresses]);

  const currentAddress = user ? userAddresses?.find((address: any) => address.id === selectedAddressId) : guestAddress;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-(--foreground)">Adres zamieszkania</h2>

      {currentAddress ? (
        <div className="mb-4 space-y-6">
          <div className="border border-(--border) bg-(--surface-secondary) p-5">
            <h2 className="mb-3 font-semibold text-(--foreground)">Dane do zamówienia</h2>

            <p className="font-medium text-(--foreground)">{currentAddress.street}</p>

            <p className="text-(--foreground-secondary)">
              {currentAddress.postal_code} {currentAddress.city}
            </p>

            {currentAddress.country && <p className="text-(--foreground-secondary)">{currentAddress.country}</p>}
          </div>
        </div>
      ) : (
        <div className="border border-(--border) bg-(--surface-secondary) p-5 text-(--foreground)">Nie wybrano adresu</div>
      )}

      {user && userAddresses && userAddresses.length > 0 ? (
        <div className="space-y-4">
          {userAddresses.map((address: any) => (
            <label
              key={address.id}
              className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                selectedAddressId === address.id
                  ? "border-orange-500 bg-(--surface-secondary) ring-1 ring-orange-500"
                  : "border-(--border) bg-(--surface) hover:border-orange-500"
              } `}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === address.id}
                onChange={() => {
                  setSelectedAddressId(address.id);
                  updateCheckout({ address });
                }}
                className="mt-1"
              />

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-(--foreground)">{address.street}</p>

                  {address.is_default && <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Domyślny</span>}
                </div>

                <p className="text-(--foreground-secondary)">
                  {address.postal_code} {address.city}
                </p>
              </div>
            </label>
          ))}
        </div>
      ) : guestAddress ? (
        <div className="border border-dashed border-(--border) bg-(--surface) p-6 text-center text-(--foreground-secondary)">
          Nie masz zapisanych adresów.
        </div>
      ) : (
        ""
      )}

      <button
        type="button"
        className="mt-6 cursor-pointer border border-orange-500 px-5 py-3 text-orange-500 transition hover:bg-orange-50"
        onClick={() => setCloseModal(true)}
      >
        {user ? "+ Dodaj nowy adres" : "Zmień adres"}
      </button>

      <div className="mt-8 flex justify-between">
        <GrayButton onClick={back}>Wstecz</GrayButton>

        <OrangeButton onClick={next} disabled={!selectedAddressId}>
          Dalej
        </OrangeButton>
      </div>

      {closeModal && (
        <AddressModal
          closeModal={() => setCloseModal(false)}
          saveAddress={(data) => {
            if (user) {
              saveAddress(data, {
                onSuccess: (response) => {
                  const newAddress = response.data.address;
                  setSelectedAddressId(newAddress.id);
                  updateCheckout({ address: newAddress });
                  setCloseModal(false);
                },
              });
              return;
            }
            const newAddress = {
              id: crypto.randomUUID(),
              ...data,
              is_default: true,
            };
            setGuestAddress(newAddress);
            setSelectedAddressId(newAddress.id);
            updateCheckout({ address: newAddress });
            setCloseModal(false);
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
