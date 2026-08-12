import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCheckout } from "../../../zustand/states/checkOutStore";
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
  const updateCheckout = useCheckout((state) => state.setCheckoutData);
  const checkoutData = useCheckout((state) => state.checkoutData);

  const { user: currentUser } = useAuth();

  const isGuest = !currentUser;
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [useOtherData, setUseOtherData] = useState(false);
  const navigate = useNavigate();

  const customer = currentUser && !guestCheckout && !useOtherData ? currentUser : checkoutData?.customer;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),

    defaultValues: {
      name: checkoutData?.customer?.name ?? "",
      last_name: checkoutData?.customer?.last_name ?? "",
      email: checkoutData?.customer?.email ?? "",
      phone: checkoutData?.customer?.phone ?? "",
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
      <h2 className="mb-6 text-2xl font-bold text-(--foreground)">Dane klienta</h2>

      {!currentUser && !guestCheckout && (
        <div className="mb-6 flex flex-col gap-2 border border-(--border) bg-(--surface-secondary) p-5">
          <h3 className="mb-1 font-semibold text-(--foreground)">Masz już konto?</h3>

          <p className="mb-3 text-(--foreground-secondary)">Zaloguj się lub kontynuuj jako gość.</p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="w-full cursor-pointer bg-orange-500 px-5 py-3 text-white transition hover:bg-orange-600 sm:w-auto"
              onClick={() => navigate("/login?cart=1")}
            >
              Zaloguj się
            </button>

            <button
              className="w-full cursor-pointer border border-(--border) px-5 py-3 text-(--foreground) transition hover:bg-(--surface-hover) sm:w-auto"
              onClick={() => setGuestCheckout(true)}
            >
              Kontynuuj jako gość
            </button>
          </div>
        </div>
      )}

      {currentUser && !guestCheckout && !useOtherData ? (
        <div className="space-y-6">
          {customer?.name && customer?.last_name && customer?.email ? (
            <div className="border border-(--border) bg-(--surface-secondary) p-5">
              <h2 className="mb-3 font-semibold text-(--foreground)">Dane do zamówienia</h2>

              <p className="text-(--foreground)">
                {customer.name} {customer.last_name}
              </p>

              <p className="text-(--foreground-secondary)">{customer.email}</p>

              <p className="text-(--foreground-secondary)">{customer.phone}</p>
            </div>
          ) : null}

          <div className="flex justify-between">
            <div className="flex gap-2">
              <GrayButton onClick={() => setUseOtherData(true)}>Użyj innych danych</GrayButton>

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
            <label className="mb-1 block text-sm font-medium text-(--foreground)">Imię</label>

            <input
              {...register("name")}
              className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) outline-none focus:border-orange-500"
            />

            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-(--foreground)">Nazwisko</label>

            <input
              {...register("last_name")}
              className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) outline-none focus:border-orange-500"
            />

            {errors.last_name && <p className="text-sm text-red-500">{errors.last_name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-(--foreground)">Email</label>

            <input
              {...register("email")}
              className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) outline-none focus:border-orange-500"
            />

            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-(--foreground)">Telefon</label>

            <input
              {...register("phone")}
              className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) outline-none focus:border-orange-500"
              maxLength={9}
            />

            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          <div className={`flex ${isGuest ? "justify-end" : "justify-between"}`}>
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

            <button type="submit" className="cursor-pointer bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600">
              Dalej
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
