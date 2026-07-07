import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adressesSchema, type AddressFrom } from "../../schemas/addressSchema";

type Props = {
  closeModal: () => void;
  saveAddress: (data: any) => void;
  defaultValues: any;
};

export default function AddressModal({
  closeModal,
  saveAddress,
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFrom>({
    resolver: zodResolver(adressesSchema),
    defaultValues: defaultValues,
  });

  const postalCode = watch("postalCode");

  const formatPostalCode = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 5);

    if (limited.length > 2) {
      return `${limited.slice(0, 2)}-${limited.slice(2)}`;
    }

    return limited;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 w-full max-w-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Adres dostawy</h2>

          <form onSubmit={handleSubmit(saveAddress)} className="space-y-4">
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
                {...register("postalCode")}
                value={postalCode}
                onChange={(e) => {
                  setValue("postalCode", formatPostalCode(e.target.value), {
                    shouldValidate: true,
                  });
                }}
                className="border p-2 w-full border-gray-200 rounded"
              />

              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.postalCode.message}
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

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={closeModal}
                className="border border-gray-200 px-4 py-2 roundedcursor-pointer"
              >
                Anuluj
              </button>

              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 roundedcursor-pointer hover:bg-orange-600"
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
