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
      console.log(data);
      updateAddress({ ...data, aid: defaultValues.aid });
    } else {
      saveAddress(data);
    }
  };

  const onError = (errors: any) => {
    console.log("ERRORS", errors);
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 w-full max-w-md ">
          <h2 className="text-xl font-bold mb-4">Adres dostawy</h2>

          <form
            onSubmit={(e) => {
              handleSubmit(onSubmit, onError)(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Miasto</label>

              <input
                {...register("city")}
                className="border p-2 w-full border-gray-200 rounded"
              />

              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
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
                className="border p-2 w-full border-gray-200 rounded"
              />

              {errors.postal_code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.postal_code.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Ulica i numer
              </label>

              <input
                {...register("street")}
                className="border p-2 w-full border-gray-200 rounded"
              />

              {errors.street && (
                <p className="text-red-500 text-sm mt-1">
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
                className="border border-gray-200 px-4 py-2  cursor-pointer"
              >
                Anuluj
              </button>

              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 cursor-pointer hover:bg-orange-600"
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
