import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../schemas/profileSchema";
import type { ProfileFormData } from "../../schemas/profileSchema";
import useAdresses from "../../hooks/useAdresses";
import AddressCard from "../../components/ui/AddresesCard";
import AddressModal from "../../components/ui/AddressModal";
import type { AddressFrom } from "../../schemas/addressSchema";
import NotificationCard from "../../components/ui/NotificationCard";

type Tab =
  | "dashboard"
  | "orders"
  | "order-details"
  | "profile"
  | "addresses"
  | "security"
  | "settings";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentEditAddress, setCurrentEditAdress] = useState<AddressFrom>({
    city: "",
    postal_code: "",
    street: "",
    isEdit: false,
    is_default: false,
  });
  const [edited, setEdited] = useState(false);
  const { user } = useAuth();

  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name,
      lastName: user?.lastName,
      email: user?.email,
      id: user?.id,
      phone: user?.phone,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        id: user.id,
      });
    }
  }, [user, reset]);

  const { mutate, isError, isSuccess } = useMutation({
    mutationFn: (data: ProfileFormData) =>
      axios.patch("/api/settings/edit-user/personal-data", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => console.log(err),
  });

  const {
    userAddresses,
    addressSetSuccess,
    saveAddress,
    updateAddress,
    addressUpdateSuccess,
    deleteAddress,
    addressDeleteSuccess,
  } = useAdresses(user?.id, token);

  const onSubmit = (data: ProfileFormData) => {
    mutate(data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Panel użytkownika</h2>
            <p className="text-gray-500">Witaj w swoim koncie</p>
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Moje zamówienia</h2>

            <div className="space-y-3">
              {[1, 2, 3].map((id) => (
                <div
                  key={id}
                  className="border p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">Zamówienie #{id}</p>
                    <p className="text-sm text-gray-500">Status: wysłane</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrderId(String(id));
                      setActiveTab("order-details");
                    }}
                    className="text-orange-500 hover:underline"
                  >
                    Szczegóły
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "order-details":
        return (
          <div>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-sm text-gray-500 mb-4 hover:underline"
            >
              ← Powrót
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Zamówienie #{selectedOrderId}
            </h2>

            <p className="text-gray-500">
              Szczegóły zamówienia (produkty, status, dostawa)
            </p>
          </div>
        );

      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dane osobowe</h2>

            <div className="space-y-3">
              <div>
                <p className="text-gray-500 mb-2">
                  Zarządzaj swoimi danymi konta
                </p>
                {isSuccess && (
                  <NotificationCard message={"Dane zostały zapisane"} />
                )}
                {addressDeleteSuccess && (
                  <NotificationCard message={"Adres został usunięty"} />
                )}

                {isError && (
                  <div className=" p-4 border-l-4 border-orange-500 bg-orange-50 text-sm text-red-700">
                    Wystąpił błąd podczas zapisu
                  </div>
                )}

                <form
                  className="max-w-xl space-y-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <fieldset>
                    <div>
                      <label className="text-sm text-gray-600 border-">
                        Imię
                      </label>

                      <input
                        {...register("firstName")}
                        placeholder="Imię"
                        className="w-full border p-3 focus:outline-none focus:border-orange-500 border-gray-200"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                      </p>
                    )}

                    <div>
                      <label className="text-sm text-gray-600">Nazwisko</label>

                      <input
                        placeholder="Nazwisko"
                        {...register("lastName")}
                        className="w-full border p-3 focus:outline-none focus:border-orange-500 border-gray-200"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                      </p>
                    )}

                    <div>
                      <label className="text-sm text-gray-600">Email</label>

                      <input
                        {...register("email")}
                        placeholder="Email"
                        className="w-full border p-3 border-gray-200"
                      />

                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 border-gray-200">
                        Telefon
                      </label>

                      <input
                        {...register("phone")}
                        placeholder="Telefon"
                        maxLength={9}
                        className="w-full border p-3 focus:outline-none focus:border-orange-500 border-gray-200"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        className="flex-1 bg-orange-500 text-white py-3 hover:bg-orange-600 transition"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                      </button>

                      <button
                        className="flex-1 border py-3 hover:bg-gray-100 transition"
                        type="reset"
                      >
                        Anuluj
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        );

      case "addresses":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Adresy dostawy</h2>

            {(addressSetSuccess || addressUpdateSuccess) && (
              <NotificationCard
                message={
                  addressSetSuccess
                    ? `Dane zostały zapisane`
                    : `Zapisano zmiany`
                }
              />
            )}
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
                    deleteAddress(address.id);
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
          </div>
        );

      case "security":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Bezpieczeństwo</h2>

            <div className="space-y-3">
              <input className="border p-2 w-full" placeholder="Nowe hasło" />
              <button className="bg-orange-500 text-white px-4 py-2">
                Zmień hasło
              </button>
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Ustawienia</h2>

            <p className="text-gray-500">Preferencje konta i powiadomień</p>
          </div>
        );
    }
  };

  if (!token) {
    return <>Brak dostępu</>;
  }
  return (
    <>
      <Navbar />
      <section className="bg-orange-500 text-white py-14 text-center">
        <h1 className="text-4xl font-bold">Moje konto</h1>
        <p className="mt-2">Zarządzaj swoim profilem i zamówieniami</p>
      </section>

      <main className="container mx-auto px-6 py-10 grid grid-cols-12 gap-8">
        <aside className="col-span-3 bg-white shadow-md h-fit ">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "dashboard" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Panel
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "orders" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Zamówienia i dane dostaw
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "profile" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Dane osobowe
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "addresses" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Adresy
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "security" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Bezpieczeństwo
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left p-4 border-gray-200 cursor-pointer ${
              activeTab === "settings" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Ustawienia
          </button>
        </aside>

        <section className="col-span-9 bg-white shadow-md p-6 min-h-150 border-gray-200">
          {renderContent()}
        </section>
      </main>
    </>
  );
};

export default AccountPage;
