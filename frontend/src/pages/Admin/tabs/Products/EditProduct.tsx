import { Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import {
  productEditSchema,
  type EditProductForm,
} from "../../../../schemas/productSchema";

import ImageUploader from "../../../../components/ui/ImageUploader";
import { useSeller } from "../../../../hooks/useSeller";

type Props = {
  product: any;
};

const ProductEditForm = ({ product }: Props) => {
  console.log(product);

  const [newImages, setNewImages] = useState<File[]>([]);

  const {
    updateProduct: { mutate: updateProduct },
    uploadImage,
  } = useSeller();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProductForm>({
    resolver: zodResolver(productEditSchema),

    defaultValues: {
      name: product.name ?? "",

      brand: product.brand ?? "",

      model: product.model ?? "",

      description: product.description ?? "",

      price: String(product.price ?? ""),

      stock: Number(product.stock ?? ""),

      category_id: String(product.category_id ?? ""),

      subcategory_id: String(product.subcategory_id ?? ""),

      attributes:
        typeof product.attributes === "string"
          ? JSON.parse(product.attributes)
          : product.attributes ?? [],

      images: [],
      existingImages: [],
      removedImages: [],
    },
  });

  const getImages = () => {
    if (!product.images) return [];

    const base = `${import.meta.env.VITE_API_URL}uploads/products/${
      product.seller_id
    }/${product.id}/`;

    return product.images.split(",").map((img: string) => `${base}${img}`);
  };

  const onSubmit = (data: any) => {
    updateProduct(
      {
        id: product.id,

        product: {
          ...data,

          removedImages: data.removedImages,
        },
      },

      {
        onSuccess() {
          if (newImages.length) {
            const formData = new FormData();

            newImages.forEach((file) => {
              formData.append("images", file);
            });

            uploadImage.mutate({
              productId: product.id,
              formData,
            });
          }
          toast.success("Pomyślnie zapisano zmiany");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="p-6 bg-white border border-gray-300">
        <h2 className="mb-6 text-xl font-semibold">Informacje o produkcie</h2>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Nazwa produktu</label>

            <input
              {...register("name")}
              className="input"
              placeholder="Np. Lenovo Legion 5"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Opis produktu</label>

            <textarea
              {...register("description")}
              rows={5}
              className="input resize-none"
              placeholder="Opis produktu..."
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="p-6 bg-white border border-gray-300">
        <h2 className="mb-6 text-xl font-semibold">Sprzedaż</h2>

        <div className="md:grid-cols-2 grid gap-5">
          <div>
            <label className="block mb-2 font-medium">Cena</label>

            <div className="relative">
              <input
                {...register("price")}
                type="number"
                className="input pr-12"
                placeholder="0.00"
              />

              <span className="right-4 top-3 absolute text-gray-500">zł</span>
            </div>

            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Stan magazynu</label>

            <input
              {...register("stock")}
              type="number"
              className="input"
              placeholder="0"
            />

            {errors.stock && (
              <p className="mt-1 text-sm text-red-500">
                {errors.stock.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="p-6 bg-white border border-gray-300">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold">Zdjęcia produktu</h2>

            <p className="mt-1 text-sm text-gray-500">
              Pierwsze zdjęcie będzie zdjęciem głównym produktu.
            </p>
          </div>
        </div>

        <ImageUploader
          images={getImages()}
          value={watch("images")}
          onChange={(files) => {
            setNewImages(files);

            setValue("images", files, {
              shouldValidate: true,
            });
          }}
          onRemoveExisting={(image) => {
            const filename = image.split("/").pop();

            if (filename) {
              const current = watch("removedImages") ?? [];

              setValue("removedImages", [...current, filename], {
                shouldValidate: true,
              });
            }
          }}
          multiple
          maxFiles={8}
        />

        {errors.images && (
          <p className="mt-2 text-sm text-red-500">{errors.images.message}</p>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className=" hover:bg-orange-600 flex items-center gap-2 px-8 py-3 font-semibold text-white transition bg-orange-500"
        >
          <Save size={18} />
          Zapisz zmiany
        </button>
      </div>
    </form>
  );
};

export default ProductEditForm;
