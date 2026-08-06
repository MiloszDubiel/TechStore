import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "../ui/ImageUploader";
import {
  sellerProfileSchema,
  type SellerProfileType,
} from "../../schemas/sellerSchemta";

import { Save, Store, Building2 } from "lucide-react";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<SellerProfileType>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  hideButton?: boolean;
  storeData?: any;
  onBack?: any;
};

const SellerProfileForm = ({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
  hideButton,
  storeData = null,
  onBack,
}: Props) => {
  let data = storeData;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SellerProfileType>({
    resolver: zodResolver(sellerProfileSchema),
    defaultValues,
  });

  const [removedLogo, setRemovedLogo] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      reset({
        shop_name: data?.shop_name ?? "",
        description: data?.description ?? "",
        company_name: data?.company_name ?? "",
        nip: data?.nip ?? "",
        street: data?.street ?? "",
        city: data?.city ?? "",
        postal_code: data?.postal_code ?? "",
      });
    }
  }, [data]);
  const handleFormSubmit = (data: SellerProfileType) => {
    onSubmit({
      ...data,
      removedLogo,
      logo: values[0] ?? null,
    });
  };

  const isEdit = mode === "edit";
  const [values, setValues] = useState<File[]>([]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <section
        className="
      border border-(--border)
      bg-(--surface)
      p-6
    "
      >
        {hideButton && (
          <button
            type="button"
            onClick={onBack}
            className=" hover:bg-orange-600 px-4 py-3 mb-2 text-white transition bg-orange-500 cursor-pointer"
          >
            ← Powrót
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <Store size={22} className="text-orange-500" />

          <h2 className="text-xl font-semibold">Dane sklepu</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Nazwa sklepu</label>

            <input
              {...register("shop_name")}
              placeholder="Nazwa sklepu"
              className="
            w-full
            border border-(--border)
            bg-(--surface-secondary)
            px-4 py-3
            text-(--foreground)
            outline-none
            placeholder:text-(--foreground-secondary)
            focus:border-orange-500
          "
            />

            {errors.shop_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.shop_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Opis sklepu</label>

            <textarea
              {...register("description")}
              rows={5}
              placeholder="Opis sklepu..."
              className="
            w-full
            resize-none
            border border-(--border)
            bg-(--surface-secondary)
            px-4 py-3
            text-(--foreground)
            outline-none
            placeholder:text-(--foreground-secondary)
            focus:border-orange-500
          "
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Logo sklepu</label>

            <ImageUploader
              images={
                data?.logo
                  ? [
                      `${import.meta.env.VITE_API_URL}uploads/sellers/${
                        data.user_id || data.id
                      }/${data.logo}`,
                    ]
                  : []
              }
              value={values}
              onChange={(files) => {
                setValues(files);
                setValue("logo", files[0] ?? undefined, {
                  shouldValidate: true,
                });
              }}
              onRemoveExisting={(image) => {
                setRemovedLogo(image);
              }}
              replace={true}
              multiple={false}
            />

            {errors.logo && (
              <p className="mt-1 text-sm text-red-500">{errors.logo.message}</p>
            )}
          </div>
        </div>
      </section>

      <section
        className="
      border border-(--border)
      bg-(--surface)
      p-6
    "
      >
        <div className="flex items-center gap-3 mb-6">
          <Building2 size={22} className="text-orange-500" />

          <h2 className="text-xl font-semibold">Dane firmy</h2>
        </div>

        <div className="md:grid-cols-2 grid grid-cols-1 gap-5">
          {[
            ["company_name", "Nazwa firmy"],
            ["nip", "NIP"],
            ["street", "Ulica"],
            ["city", "Miasto"],
            ["postal_code", "Kod pocztowy"],
          ].map(([field, placeholder]) => (
            <div key={field}>
              <input
                {...register(field)}
                placeholder={placeholder}
                className="
              w-full
              border border-(--border)
              bg-(--surface-secondary)
              px-4 py-3
              text-(--foreground)
              outline-none
              placeholder:text-(--foreground-secondary)
              focus:border-orange-500
            "
              />

              {errors[field] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {!hideButton && (
        <button
          disabled={isLoading}
          className=" hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition bg-orange-500 cursor-pointer"
        >
          {isEdit ? (
            <>
              <Save size={18} />
              Zapisz zmiany
            </>
          ) : (
            <>
              <Store size={18} />
              Załóż sklep
            </>
          )}
        </button>
      )}
    </form>
  );
};
export default SellerProfileForm;
