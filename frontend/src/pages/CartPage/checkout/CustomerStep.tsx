import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCheckout } from "../../../context/CheckoutContext";
import { useAuth, type User } from "../../../context/AuthContext";
import { type CustomerForm } from "../../../schemas/customerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "../../../schemas/customerSchema";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";

type Props = {
  next: () => void;
};

export default function CustomerStep({ next }: Props) {
  const { updateCheckout, checkoutData } = useCheckout();

  const [useOtherData, setUseOtherData] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  const { user: currentUser } = useAuth();
  console.log(checkoutData);

  const selectCurrentData = () => {
    updateCheckout({
      customer: {
        ...(checkoutData.customer ?? (currentUser as User)),
      },
    });
    next();
  };

  const onSubmit = (data: CustomerForm) => {
    updateCheckout({
      customer: {
        ...data,
      },
    });
    setUseOtherData(false);
  };

  const onError = (errors: any) => {
    console.log("Form submission errors:", errors);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dane klienta</h2>

      {!useOtherData ? (
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
                {currentUser!.name} {currentUser!.last_name}
              </p>

              <p className="text-gray-500">{currentUser!.email}</p>
              <p className="text-gray-500">{currentUser!.phone}</p>
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

          <div className="flex justify-between">
            <GrayButton
              onClick={() => {
                setUseOtherData(false);
              }}
            >
              Wstecz
            </GrayButton>
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
              Zapisz
            </button>

            {!useOtherData && (
              <button
                type="submit"
                className="
                  bg-orange-500
                  text-white
                  px-6
                py-3
              
              "
              >
                Dalej
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
