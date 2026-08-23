import AddressCard from "../../../components/ui/AddresesCard";
import AddressModal from "../../../components/ui/AddressModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useState } from "react";
import useAdresses from "../../../hooks/useAdresses";
import type { AddressFrom } from "../../../schemas/addressSchema";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

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

  const { userAddresses, saveAddress, updateAddress, deleteAddress } = useAdresses(user?.id);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-(--foreground)">Adresy dostawy</h2>

      <button
        className="mb-4 cursor-pointer bg-(--primary) px-4 py-2 text-white transition hover:bg-(--primary-hover)"
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
      <h4 className="mb-4 text-sm font-bold text-(--foreground)">Maksymalnie 5 adresów</h4>

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
        <p className="text-(--foreground-secondary) text-center">Brak zapisanych adresów</p>
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
          onCancel={() => setOpenConfirm((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={() => {
            deleteAddress(openConfirm.id, { onSuccess: () => toast.success("Usunięto adres") });
            setOpenConfirm({ id: "", isOpen: false });
          }}
        />
      )}
    </div>
  );
};
