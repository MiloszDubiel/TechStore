import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { adressesSchema, type AddressFrom } from "../../schemas/addressSchema";

type Props = {
  closeModal: () => void;
  saveAddress: (data: any) => any;
  defaultValues: any;
  isEdited: boolean;
  updateAddress: (data: any) => any;
};

export default function AddressModal({
  closeModal,
  saveAddress,
  defaultValues,
  updateAddress,
  isEdited,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFrom>({
    resolver: zodResolver(adressesSchema),
    defaultValues: defaultValues,
  });

  const formatPostalCode = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 5);

    if (limited.length > 2) {
      return `${limited.slice(0, 2)}-${limited.slice(2)}`;
    }

    return limited;
  };

  const onSubmit = (data: AddressFrom) => {
    if (isEdited) {
      updateAddress({ ...data, aid: defaultValues.aid });
    } else {
      saveAddress(data);
    }
  };

  return (
    <div className="bg-black/50 fixed inset-0 z-10 flex items-center justify-center">
      <div className="bg-black/50 fixed inset-0 flex items-center justify-center">
        <div className=" w-full max-w-md p-6 bg-white">
          <h2 className="mb-4 text-xl font-bold">Adres dostawy</h2>

          <form
            onSubmit={(e) => {
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">Miasto</label>

              <input
                {...register("city")}
                className="w-full p-2 border border-gray-200 rounded"
              />

              {errors.city && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Kod pocztowy
              </label>

              <input
                {...register("postal_code")}
                onChange={(e) => {
                  setValue("postal_code", formatPostalCode(e.target.value), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                className="w-full p-2 border border-gray-200 rounded"
              />

              {errors.postal_code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.postal_code.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Ulica i numer
              </label>

              <input
                {...register("street")}
                className="w-full p-2 border border-gray-200 rounded"
              />

              {errors.street && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.street.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="is_default"
                type="checkbox"
                {...register("is_default", {
                  setValueAs: (value) => Boolean(value),
                })}
                className="w-4 h-4 cursor-pointer"
              />

              <label
                htmlFor="is_default"
                className="text-sm cursor-pointer select-none"
              >
                Ustaw jako adres domyślny
              </label>
            </div>
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-200 cursor-pointer"
              >
                Anuluj
              </button>

              <button
                type="submit"
                className="hover:bg-orange-600 px-4 py-2 text-white bg-orange-500 cursor-pointer"
              >
                Zapisz adres
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
