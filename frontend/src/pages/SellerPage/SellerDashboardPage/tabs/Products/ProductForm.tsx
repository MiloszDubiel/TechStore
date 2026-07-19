import { Save, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ImageUploader from "../../../../../components/ui/ImageUploader";
import { useEffect } from "react";

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
  isSuccess,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const selectedCategory = watch("category_id");

  const filteredSubcategories = subcategories?.filter(
    (item) => Number(item.category_id) === Number(selectedCategory)
  );

  useEffect(() => {
    reset();
  }, [isSuccess]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
      className="space-y-6"
    >
      <div>
        <label className="block mb-2 font-medium">Nazwa produktu</label>

        <input
          {...register("name")}
          placeholder="Np. Lenovo Legion 5"
          className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
        />

        <FormError message={errors.name?.message} />
      </div>

      <div>
        <label className="block mb-2 font-medium">Producent</label>

        <input
          {...register("brand")}
          placeholder="Np. Lenovo"
          className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
        />

        <FormError message={errors?.brand?.message} />
      </div>

      <div>
        <label className="block mb-2 font-medium">Model</label>

        <input
          {...register("model")}
          placeholder="Np. Legion 5 15ACH6"
          className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
        />

        <FormError message={errors?.model?.message} />
      </div>

      <div>
        <label className="block mb-2 font-medium">Opis</label>

        <textarea
          {...register("description")}
          rows={6}
          placeholder="Opis produktu..."
          className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none resize-none"
        />

        <FormError message={errors?.description?.message} />
      </div>

      <div className="md:grid-cols-2 grid grid-cols-1 gap-6">
        <div>
          <label className="block mb-2 font-medium">Cena</label>

          <input
            type="number"
            {...register("price")}
            placeholder="0.00"
            className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300"
          />

          <FormError message={errors?.price?.message} />
        </div>

        <div>
          <label className="block mb-2 font-medium">Stan magazynowy</label>

          <input
            type="number"
            {...register("stock")}
            placeholder="0"
            className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300"
          />

          <FormError message={errors?.stock?.message} />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Kategoria</label>

        <select
          {...register("category_id")}
          onChange={(e) => {
            setValue("category_id", e.target.value);

            setValue("subcategory_id", "");
          }}
          className="w-full px-4 py-3 border border-gray-300"
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
        <label className="block mb-2 font-medium">Podkategoria</label>

        <select
          {...register("subcategory_id")}
          className="w-full px-4 py-3 border border-gray-300"
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

      <div className="p-5 border border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <label className="text-lg font-medium">Parametry produktu</label>

          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                value: "",
              })
            }
            className="hover:bg-orange-50 flex items-center gap-2 px-3 py-2 text-sm text-orange-500 border border-orange-500"
          >
            <Plus size={18} />
            Dodaj parametr
          </button>
        </div>

        <div className="overflow-hidden border border-gray-200">
          <div className="grid grid-cols-[1fr_1fr_60px] bg-gray-50 border-b border-gray-300">
            <div className="px-4 py-3 font-medium">Nazwa parametru</div>

            <div className="px-4 py-3 font-medium">Wartość</div>

            <div />
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid items-center grid-cols-[1fr_1fr_60px] gap-3 p-3 border-b border-gray-300"
            >
              <div>
                <input
                  {...register(`attributes.${index}.name`)}
                  placeholder="Np. RAM"
                  className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-2 border border-gray-300"
                />
              </div>

              <div>
                <input
                  {...register(`attributes.${index}.value`)}
                  placeholder="Np. 16GB"
                  className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-2 border border-gray-300"
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {typeof errors.attributes?.message === "string" && (
          <p className="mt-2 text-sm text-red-500">
            {errors.attributes.message}
          </p>
        )}
      </div>
      <div className="p-6 bg-white border border-gray-300">
        <h2 className="mb-3 text-xl font-semibold">Zdjęcia</h2>

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
        <button
          type="submit"
          className="hover:bg-orange-600 flex items-center gap-2 px-6 py-3 text-white transition bg-orange-500"
        >
          <Save size={18} />
          {mode === "edit" ? "Zapisz zmiany" : "Dodaj produkt do sprzedaży"}
        </button>
      </div>
    </form>
  );
};
export default ProductForm;
