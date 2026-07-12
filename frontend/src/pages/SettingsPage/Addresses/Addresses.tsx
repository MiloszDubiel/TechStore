import AddressCard from "../../../components/ui/AddresesCard";
import AddressModal from "../../../components/ui/AddressModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useState } from "react";
import useAdresses from "../../../hooks/useAdresses";
import type { AddressFrom } from "../../../schemas/addressSchema";
import { useAuth } from "../../../context/AuthContext";
import NotificationCard from "../../../components/ui/NotificationCard";

export const Addresses = () => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentEditAddress, setCurrentEditAdress] = useState<AddressFrom>({
    city: "",
    postal_code: "",
    street: "",
    isEdit: false,
    is_default: false,
  });
  const [openConfirm, setOpenConfirm] = useState({ id: "", isOpen: false });
  const [edited, setEdited] = useState(false);

  const { user } = useAuth();

  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");

  const {
    userAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
    addressDeleteSuccess,
  } = useAdresses(user?.id, token);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Adresy dostawy</h2>

      <button
        className="bg-orange-500 text-white px-4 py-2 mb-4 cursor-pointer"
        onClick={() => {
          setIsAddressModalOpen(true);
          setCurrentEditAdress({
            city: "",
            postal_code: "",
            street: "",
            isEdit: false,
            is_default: false,
          });
          setEdited(false);
        }}
      >
        Dodaj adres dostawy
      </button>
      {addressDeleteSuccess && (
        <NotificationCard message={"Dane zostały zapisane"} />
      )}
      {userAddresses && userAddresses.length > 0 ? (
        userAddresses?.map((address: any) => (
          <AddressCard
            key={address.id}
            id={address.id}
            title={address.is_default ? "Adres domyślny" : "Adres"}
            street={address.street}
            postalCode={address.postal_code}
            city={address.city}
            country={address.country}
            phone={user?.phone}
            isDefault={address.is_default}
            onEdit={() => {
              setCurrentEditAdress({
                ...address,
                aid: address.id,
                isEdit: true,
              });

              setEdited(true);
              setIsAddressModalOpen(true);
            }}
            onDelete={() => {
              setOpenConfirm({ isOpen: true, id: address.id });
            }}
          />
        ))
      ) : (
        <p className="text-gray-500">Brak zapisanych adresów</p>
      )}

      {isAddressModalOpen && (
        <AddressModal
          closeModal={() => setIsAddressModalOpen(false)}
          saveAddress={(data: any) => {
            saveAddress(data);
            setIsAddressModalOpen(false);
          }}
          isEdited={edited}
          updateAddress={(data: any) => {
            updateAddress(data);
            setIsAddressModalOpen(false);
          }}
          defaultValues={currentEditAddress}
        />
      )}

      {openConfirm && (
        <ConfirmModal
          isOpen={openConfirm.isOpen}
          title="Usuń adres"
          message="Czy na pewno chcesz usunąć ten adres? Tej operacji nie można cofnąć."
          confirmText="Usuń"
          cancelText="Anuluj"
          confirmVariant="danger"
          onCancel={() =>
            setOpenConfirm((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={() => {
            deleteAddress(openConfirm.id);
            setOpenConfirm({ id: "", isOpen: false });
          }}
        />
      )}
    </div>
  );
};
