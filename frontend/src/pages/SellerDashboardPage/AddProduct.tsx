import { Save, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductForm } from "../../schemas/productSchema";
import { useFieldArray } from "react-hook-form";
import { useSeller } from "../../hooks/useSeller";
import NotificationCard from "../../components/ui/NotificationCard";
import ImageUploader from "../../components/ui/ImageUploader";

const categories = [
  {
    id: 1,
    name: "Komputery",
    subcategories: [
      "Komputery stacjonarne",
      "Komputery gamingowe",
      "Komputery biurowe",
      "Mini PC",
      "Workstation",
      "All-in-One",
    ],
  },

  {
    id: 2,
    name: "Laptopy",
    subcategories: [
      "Laptopy gamingowe",
      "Laptopy biznesowe",
      "Ultrabooki",
      "Laptopy dla studentów",
      "MacBooki",
    ],
  },

  {
    id: 3,
    name: "Podzespoły komputerowe",
    subcategories: [
      "Procesory (CPU)",
      "Karty graficzne (GPU)",
      "Płyty główne",
      "Pamięć RAM",
      "Dyski SSD",
      "Dyski HDD",
      "Zasilacze",
      "Obudowy komputerowe",
      "Chłodzenie CPU",
    ],
  },
];

const AddProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [info, setInfo] = useState("");
  const [catAndSub, setCatAndSub] = useState<any>();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      brand: "",
      model: "",
      description: "",

      price: "",
      stock: "",

      category_id: "",
      subcategory_id: "",

      images: [],
      attributes: [
        {
          name: "",
          value: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,

    name: "attributes",
  });

  const {
    addProduct: { mutate, isSuccess },
    getCategories: { data: categories = [] },
    getSubcategories: { data: subcategories = [] },
  } = useSeller();

  const onSubmit = (data: ProductForm) => {
    mutate(data, {
      onSuccess: () => {
        setInfo("Produkt został dodany");
        reset();
      },
    });
  };

  const selectedCategoryId = watch("category_id");

  const filteredSubcategories = subcategories.filter(
    (sub: any) => sub.category_id === Number(selectedCategoryId)
  );
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Dodaj produkt</h2>

        <p className="text-gray-500">Utwórz nową ofertę w swoim sklepie</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Nazwa produktu</label>
          {isSuccess && <NotificationCard message={info} />}
          <input
            {...register("name")}
            placeholder="Np. Lenovo Legion 5"
            className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Producent</label>

          <input
            {...register("brand")}
            placeholder="Np. Lenovo"
            className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
          />

          {errors.brand && (
            <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Model</label>

          <input
            {...register("model")}
            placeholder="Np. Legion 5 15ACH6"
            className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
          />

          {errors.model && (
            <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Opis</label>

          <textarea
            {...register("description")}
            rows={6}
            placeholder="Opis produktu..."
            className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none resize-none"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
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

            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Stan magazynowy</label>

            <input
              type="number"
              {...register("stock")}
              placeholder="0"
              className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300"
            />

            {errors.stock && (
              <p className="mt-1 text-sm text-red-500">
                {errors.stock.message}
              </p>
            )}
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

          {errors.category_id && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category_id.message}
            </p>
          )}
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

          {errors.subcategory_id && (
            <p className="mt-1 text-sm text-red-500">
              {errors.subcategory_id.message}
            </p>
          )}
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

                  {errors.attributes?.[index]?.name && (
                    <p className="text-sm text-red-500">
                      {errors.attributes[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register(`attributes.${index}.value`)}
                    placeholder="Np. 16GB"
                    className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-2 border border-gray-300"
                  />

                  {errors.attributes?.[index]?.value && (
                    <p className="text-sm text-red-500">
                      {errors.attributes[index]?.value?.message}
                    </p>
                  )}
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

          {errors.attributes?.message && (
            <p className="mt-2 text-sm text-red-500">
              {errors.attributes.message}
            </p>
          )}
        </div>
        <div>
          <ImageUploader
            value={watch("images")}
            onChange={(files) =>
              setValue("images", files, {
                shouldValidate: true,
              })
            }
            multiple
            maxFiles={8}
          />
          {errors.images && (
            <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="hover:bg-orange-600 flex items-center gap-2 px-6 py-3 text-white transition bg-orange-500"
          >
            <Save size={18} />
            Zapisz produkt
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddProduct;
