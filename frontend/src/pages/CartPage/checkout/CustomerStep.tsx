import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCheckout } from "../../../context/CheckoutContext";
import { useAuth } from "../../../context/AuthContext";
import { type CustomerForm } from "../../../schemas/customerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "../../../schemas/customerSchema";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";
import { useNavigate } from "react-router-dom";

type Props = {
  next: () => void;
};

export default function CustomerStep({ next }: Props) {
  const { updateCheckout, checkoutData } = useCheckout();

  const { user: currentUser } = useAuth();

  const isGuest = !currentUser;
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [useOtherData, setUseOtherData] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),

    defaultValues: {
      name: checkoutData.customer?.name ?? "",
      last_name: checkoutData.customer?.last_name ?? "",
      email: checkoutData.customer?.email ?? "",
      phone: checkoutData.customer?.phone ?? "",
    },
  });

  const selectCurrentData = () => {
    if (!currentUser) {
      return;
    }

    updateCheckout({
      customer: {
        name: currentUser.name,
        last_name: currentUser.last_name,
        email: currentUser.email,
        phone: currentUser.phone,
      },
    });

    next();
  };

  const onSubmit = (data: CustomerForm) => {
    updateCheckout({
      customer: data,
    });

    next();
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-(--foreground)">
        Dane klienta
      </h2>

      {!currentUser && !guestCheckout && (
        <div className="bg-(--surface-secondary) p-5 mb-6 border border-(--border)">
          <h3 className="mb-3 font-semibold text-(--foreground)">
            Masz już konto?
          </h3>

          <p className="mb-4 text-(--foreground-secondary)">
            Zaloguj się lub kontynuuj jako gość.
          </p>

          <button
            className="hover:bg-orange-600 px-5 py-3 mr-3 text-white transition bg-orange-500 cursor-pointer"
            onClick={() => navigate("/login?cart=1")}
          >
            Zaloguj się
          </button>

          <button
            className="px-5 py-3 border border-(--border) text-(--foreground) cursor-pointer hover:bg-(--surface-hover) transition"
            onClick={() => setGuestCheckout(true)}
          >
            Kontynuuj jako gość
          </button>
        </div>
      )}

      {currentUser && !guestCheckout && !useOtherData ? (
        <div className="space-y-6">
          {checkoutData?.customer?.name &&
          checkoutData?.customer?.last_name &&
          checkoutData?.customer?.email ? (
            <div className="bg-(--surface-secondary) p-5 border border-(--border)">
              <h2 className="mb-3 font-semibold text-(--foreground)">
                Dane do zamówienia
              </h2>

              <p className="text-(--foreground)">
                {checkoutData?.customer?.name}{" "}
                {checkoutData?.customer?.last_name}
              </p>

              <p className="text-(--foreground-secondary)">
                {checkoutData?.customer?.email}
              </p>

              <p className="text-(--foreground-secondary)">
                {checkoutData?.customer?.phone}
              </p>
            </div>
          ) : (
            <div className="bg-(--surface-secondary) p-5 border border-(--border)">
              <h2 className="mb-3 font-semibold text-(--foreground)">
                Dane do zamówienia
              </h2>

              <p className="text-(--foreground)">
                {currentUser?.name} {currentUser?.last_name}
              </p>

              <p className="text-(--foreground-secondary)">
                {currentUser?.email}
              </p>

              <p className="text-(--foreground-secondary)">
                {currentUser?.phone}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex gap-2">
              <GrayButton onClick={() => setUseOtherData(true)}>
                Użyj innych danych
              </GrayButton>

              <GrayButton
                onClick={() => {
                  updateCheckout({
                    customer: {
                      name: currentUser?.name as string,
                      last_name: currentUser?.last_name as string,
                      phone: currentUser?.phone,
                      email: currentUser?.email as string,
                    },
                  });
                }}
              >
                Przywróć domyślne
              </GrayButton>
            </div>

            <OrangeButton onClick={selectCurrentData}>Dalej</OrangeButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-(--foreground)">
              Imię
            </label>

            <input
              {...register("name")}
              className="w-full p-3 bg-(--surface) text-(--foreground) border border-(--border) outline-none focus:border-orange-500"
            />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-(--foreground)">
              Nazwisko
            </label>

            <input
              {...register("last_name")}
              className="w-full p-3 bg-(--surface) text-(--foreground) border border-(--border) outline-none focus:border-orange-500"
            />

            {errors.last_name && (
              <p className="text-sm text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-(--foreground)">
              Email
            </label>

            <input
              {...register("email")}
              className="w-full p-3 bg-(--surface) text-(--foreground) border border-(--border) outline-none focus:border-orange-500"
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-(--foreground)">
              Telefon
            </label>

            <input
              {...register("phone")}
              className="w-full p-3 bg-(--surface) text-(--foreground) border border-(--border) outline-none focus:border-orange-500"
              maxLength={9}
            />

            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div
            className={`flex ${isGuest ? "justify-end" : "justify-between"}`}
          >
            {!isGuest && (
              <GrayButton
                onClick={() => {
                  if (!currentUser) {
                    setGuestCheckout(false);
                  } else {
                    setUseOtherData(false);
                  }
                }}
              >
                Wstecz
              </GrayButton>
            )}

            <button
              type="submit"
              className="hover:bg-orange-600 px-6 py-3 text-white transition bg-orange-500 cursor-pointer"
            >
              Dalej
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
