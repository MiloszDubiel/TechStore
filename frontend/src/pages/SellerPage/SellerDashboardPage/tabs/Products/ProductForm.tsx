import { Save } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "../../../../../components/ui/ImageUploader";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../../axios";

type PropsEr = {
  message?: any;
};

const FormError = ({ message }: PropsEr) => {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-500">{message}</p>;
};

type Props = {
  mode: "create" | "edit";
  schema: any;
  defaultValues: any;
  onSubmit: (data: any) => void;
  categories: any[];
  subcategories: any[];
  existingImages?: string[];
  onRemoveExisting?: (image: string) => void;
  isSuccess?: boolean;
};

const ProductForm = ({
  mode,
  schema,
  defaultValues,
  onSubmit,
  categories = [],
  subcategories = [],
  existingImages = [],
  onRemoveExisting,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "attributes",
  });

  const selectedCategory = watch("category_id");

  const filteredSubcategories = subcategories?.filter((item) => Number(item.category_id) === Number(selectedCategory));

  const selectedSubcategory = watch("subcategory_id");

  const { data: parameters = [] } = useQuery({
    queryKey: ["subcategory-parameters", selectedSubcategory],

    queryFn: async () => {
      const res = await api.get(`/api/seller/subcategories/${selectedSubcategory}/parameters`);

      return res.data.rows;
    },
    enabled: !!selectedSubcategory,
  });

  useEffect(() => {
    if (!parameters.length) return;

    const currentAttributes = watch("attributes") || [];

    const attributes = parameters.map((param: any) => {
      const existing = currentAttributes.find((attr: any) => attr.parameter_id === param.id);

      return {
        parameter_id: param.id,
        name: param.name,
        label: param.label,
        type: param.type,
        required: param.required,
        options: param.options ?? [],
        value: existing?.value ?? "",
      };
    });

    replace(attributes);
  }, [parameters, replace]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-2 block font-medium text-(--foreground)">Nazwa produktu</label>

        <input
          {...register("name")}
          placeholder="Np. Lenovo Legion 5"
          className="w-full border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground) outline-none focus:ring-2 focus:ring-orange-500"
        />

        <FormError message={errors.name?.message} />
      </div>

      <div>
        <label className="mb-2 block font-medium text-(--foreground)">Producent</label>

        <input
          {...register("brand")}
          placeholder="Np. Lenovo"
          className="w-full border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground) outline-none focus:ring-2 focus:ring-orange-500"
        />

        <FormError message={errors?.brand?.message} />
      </div>

      <div>
        <label className="mb-2 block font-medium text-(--foreground)">Model</label>

        <input
          {...register("model")}
          placeholder="Np. Legion 5 15ACH6"
          className="w-full border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground) outline-none focus:ring-2 focus:ring-orange-500"
        />

        <FormError message={errors?.model?.message} />
      </div>

      <div>
        <label className="mb-2 block font-medium text-(--foreground)">Opis</label>

        <textarea
          {...register("description")}
          rows={6}
          placeholder="Opis produktu..."
          className="w-full resize-none border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground) outline-none focus:ring-2 focus:ring-orange-500"
        />

        <FormError message={errors?.description?.message} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-(--foreground)">Cena</label>

          <input
            type="number"
            {...register("price")}
            placeholder="0.00"
            className="w-full border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground) focus:ring-2 focus:ring-orange-500"
          />

          <FormError message={errors?.price?.message} />
        </div>

        <div>
          <label className="mb-2 block font-medium text-(--foreground)">Stan magazynowy</label>

          <input
            type="number"
            {...register("stock")}
            placeholder="0"
            className="w-full border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground) focus:ring-2 focus:ring-orange-500"
          />

          <FormError message={errors?.stock?.message} />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-medium text-(--foreground)">Kategoria</label>

        <select
          {...register("category_id")}
          onChange={(e) => {
            setValue("category_id", e.target.value);
            setValue("subcategory_id", "");
          }}
          className="w-full border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground)"
        >
          <option value="">Wybierz kategorię</option>

          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <FormError message={errors?.category_id?.message} />
      </div>

      <div>
        <label className="mb-2 block font-medium text-(--foreground)">Podkategoria</label>

        <select
          {...register("subcategory_id")}
          onChange={(e) => {
            setValue("subcategory_id", e.target.value, {
              shouldValidate: true,
            });
          }}
          className="w-full border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground)"
        >
          <option value="">Wybierz podkategorię</option>

          {filteredSubcategories.map((sub: any) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <FormError message={errors?.subcategory_id?.message} />
      </div>

      <div className="border border-(--border) bg-(--surface) p-5">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-lg font-medium text-(--foreground)">Parametry produktu</label>
        </div>

        <div className="overflow-hidden border border-(--border)">
          <div className="grid grid-cols-[1fr_1fr_60px] border-b border-(--border) bg-(--surface-secondary)">
            <div className="px-4 py-3 font-medium text-(--foreground)">Nazwa parametru</div>

            <div className="px-4 py-3 font-medium text-(--foreground)">Wartość</div>

            <div />
          </div>

          {fields.map((field: any, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr] items-center gap-4 border-b border-(--border) p-3">
              <div>
                <label className="font-medium text-(--foreground)">{field.label || field.name}</label>

                <input type="hidden" value={field.parameter_id} {...register(`attributes.${index}.parameter_id`)} />

                <input type="hidden" value={field.name} {...register(`attributes.${index}.name`)} />

                <input value={field.label} type="hidden" {...register(`attributes.${index}.label`)} />

                <input type="hidden" value={field.type} {...register(`attributes.${index}.type`)} />
              </div>

              <div>
                {field.type === "select" ? (
                  <select
                    {...register(`attributes.${index}.value`)}
                    className="w-full border border-(--border) bg-(--surface) px-4 py-2 text-(--foreground)"
                  >
                    <option value="">Wybierz</option>

                    {field.options?.map((opt: any) => (
                      <option key={opt.id} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      {...register(`attributes.${index}.value`)}
                      className="w-full border border-(--border) bg-(--surface) px-4 py-2 text-(--foreground)"
                      placeholder={`Podaj ${field.label}`}
                    />

                    <FormError message={(errors as any)?.attributes?.[index]?.value?.message} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-(--border) bg-(--surface) p-6">
        <h2 className="mb-3 text-xl font-semibold text-(--foreground)">Zdjęcia</h2>

        <ImageUploader
          images={existingImages}
          value={watch("images") || []}
          onChange={(files: File[]) => {
            setValue("images", files, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          onRemoveExisting={onRemoveExisting}
          multiple
          replace={false}
          maxFiles={8}
        />

        <FormError message={errors?.images?.message} />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="flex items-center gap-2 bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600">
          <Save size={18} />
          {mode === "edit" ? "Zapisz zmiany" : "Dodaj produkt do sprzedaży"}
        </button>
      </div>
    </form>
  );
};
export default ProductForm;
