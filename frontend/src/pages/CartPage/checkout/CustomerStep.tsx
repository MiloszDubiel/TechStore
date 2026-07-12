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

  const onError = (errors: any) => {
    console.log("Form submission errors:", errors);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dane klienta</h2>
      {!currentUser && !guestCheckout && (
        <div className="mb-6 border border-gray-200 p-5 bg-gray-50">
          <h3 className="font-semibold mb-3">Masz już konto?</h3>

          <p className="text-gray-500 mb-4">
            Zaloguj się lub kontynuuj jako gość.
          </p>

          <button
            className="
      bg-orange-500
      text-white
      px-5
      py-3
      mr-3
      "
            onClick={() => navigate("/login")}
          >
            Zaloguj się
          </button>

          <button
            className="
      border
      px-5
      py-3
      "
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
            <div
              className="
              border
              border-gray-200
              
              p-5
              bg-gray-50
            "
            >
              <h2 className="font-semibold mb-3">Dane do zamówienia</h2>

              <p>
                {checkoutData?.customer?.name}{" "}
                {checkoutData?.customer?.last_name}
              </p>

              <p className="text-gray-500">{checkoutData!?.customer?.email}</p>
              <p className="text-gray-500">{checkoutData!?.customer?.phone}</p>
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
              <h2 className="font-semibold mb-3">Dane do zamówienia</h2>

              <p>
                {currentUser?.name} {currentUser?.last_name}
              </p>

              <p className="text-gray-500">{currentUser?.email}</p>
              <p className="text-gray-500">{currentUser?.phone}</p>
            </div>
          )}

          <div className="flex justify-between">
            <div className="gap-2 flex">
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
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 ">Imię</label>

            <input
              {...register("name")}
              className="
                w-full
                border
                
                p-3
                 border-gray-200
              "
            />

            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nazwisko</label>

            <input
              {...register("last_name")}
              className="w-full                border                             p-3                 border-gray-200              "
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>

            <input
              {...register("email")}
              className="
                w-full
                border
               
                p-3
                 border-gray-200
              "
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>

            <input
              {...register("phone")}
              className="
                w-full
                border
             
                p-3
                 border-gray-200
              "
              maxLength={9}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
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
              className="
      bg-orange-500
      text-white
      px-6
      py-3
      cursor-pointer
    "
            >
              Dalej
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
