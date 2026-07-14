import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerSchema, type SellerForm } from "../../schemas/sellerSchemta";
import { useAuth } from "../../context/AuthContext";
import { useSeller } from "../../hooks/useSeller";
import { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";

import { useQueryClient } from "@tanstack/react-query";

type Props = {
  isLoggedIn: boolean;
};

const BecomeSellerForm = ({ isLoggedIn }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerForm>({
    resolver: zodResolver(sellerSchema),
  });
  const queryClient = useQueryClient();

  const [disabled, setDisabled] = useState(false);

  const { user, token } = useAuth();
  const {
    get: { data },
    set: { mutate, isSuccess },
  } = useSeller(token, user?.id);

  useEffect(() => {
    if (data) {
      setDisabled(true);
    }
  }, []);

  const onSubmit = (seller: SellerForm) => {
    mutate(seller, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["seller"] });
      },
      onError: (err) => console.log(err),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isLoggedIn && (
        <div className="bg-gray-50 p-4 border border-gray-300">
          <h3 className="font-semibold text-gray-800">Konto użytkownika</h3>

          <p className="mt-1 text-sm text-gray-600">
            Aby prowadzić sklep, musisz posiadać konto.
          </p>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Dane firmy</h2>
        {isSuccess && <NotificationCard message="Utworzono sklep" />}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Nazwa sklepu
            </label>

            <input
              {...register("shop_name")}
              placeholder="Sklep"
              className=" focus:border-orange-500 w-full px-4 py-3 text-gray-900 border border-gray-300 outline-none"
            />

            {errors.shop_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.shop_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              NIP
            </label>

            <input
              {...register("nip")}
              placeholder="Wymagany"
              className=" focus:border-orange-500 w-full px-4 py-3 text-gray-900 border border-gray-300 outline-none"
              maxLength={10}
            />
            {errors.nip && (
              <p className="mt-1 text-sm text-red-500">{errors.nip.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Opis sklepu
            </label>

            <textarea
              {...register("description")}
              placeholder="Opisz czym zajmuje się Twój sklep..."
              rows={5}
              className=" focus:border-orange-500 w-full px-4 py-3 text-gray-900 border border-gray-300 outline-none resize-none"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Logo sklepu
            </label>

            <input
              type="file"
              {...register("logo")}
              className=" file:border-0 file:bg-orange-500 file:text-white file:px-4 file:py-2 file:mr-4 w-full px-4 py-3 text-gray-700 border border-gray-300"
            />

            {errors.logo && (
              <p className="mt-1 text-sm text-red-500">{errors.logo.message}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className=" hover:bg-orange-600 disabled w-full py-3 font-semibold text-white transition bg-orange-500"
        disabled={disabled}
      >
        Załóż sklep
      </button>
    </form>
  );
};
export default BecomeSellerForm;
