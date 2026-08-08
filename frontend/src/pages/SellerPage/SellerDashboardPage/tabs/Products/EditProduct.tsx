import { useState } from "react";
import ProductForm from "./ProductForm";
import { productEditSchema } from "../../../../../schemas/productSchema";
import { useSeller } from "../../../../../hooks/useSeller";
import { toast } from "react-toastify";
import { useImage } from "../../../../../hooks/useImage";

type Props = {
  product: any;
  onBack: () => void;
};

const EditProduct = ({ product, onBack }: Props) => {
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const {
    getCategories: { data: categories = [] },
    getSubcategories: { data: subcategories = [] },

    updateProduct: { mutate: updateProduct },

    uploadImage: { mutate: uploadAnotherImage },
  } = useSeller();

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="cursor-pointer bg-orange-500 px-4 py-3 text-white hover:bg-orange-600">
        ← Powrót
      </button>

      <ProductForm
        mode="edit"
        schema={productEditSchema}
        defaultValues={{
          name: product.name,
          description: product.description,
          brand: product.brand,
          model: product.model,
          price: String(product.price),
          stock: String(product.stock),
          category_id: String(product.category_id),
          subcategory_id: String(product.subcategory_id),

          attributes: typeof product.attributes === "string" ? JSON.parse(product.attributes) : (product.attributes ?? []),

          images: [],
          existingImages: useImage(product),
          removedImages: [],
        }}
        categories={categories}
        subcategories={subcategories}
        existingImages={useImage(product)}
        onRemoveExisting={(image) => {
          const filename = image.split("/").pop();

          if (filename) {
            setRemovedImages((prev) => [...prev, filename]);
          }
        }}
        onSubmit={(data) => {
          const formData = new FormData();

          formData.append("name", data.name);
          formData.append("description", data.description);
          formData.append("brand", data.brand);
          formData.append("model", data.model);
          formData.append("price", data.price);
          formData.append("stock", data.stock);
          formData.append("category_id", data.category_id);
          formData.append("subcategory_id", data.subcategory_id);
          formData.append("attributes", JSON.stringify(data.attributes));
          formData.append("removedImages", JSON.stringify(removedImages));

          console.log(data.stock);

          updateProduct(
            {
              id: product.id,
              product: formData,
            },
            {
              onSuccess: () => {
                if (data.images?.length) {
                  const imagesFormData = new FormData();

                  data.images.forEach((file: any) => {
                    imagesFormData.append("images", file);
                  });

                  uploadAnotherImage(
                    {
                      productId: product.id,
                      formData: imagesFormData,
                    },

                    {
                      onSuccess: () => {
                        toast.success("Produkt oraz zdjęcia zostały zaktualizowane");

                        onBack();
                      },

                      onError: () => {
                        toast.warning("Produkt zapisany, ale zdjęcia nie zostały dodane");

                        onBack();
                      },
                    },
                  );
                } else {
                  toast.success("Produkt został zaktualizowany");

                  onBack();
                }
              },

              onError: () => {
                toast.error("Nie udało się zaktualizować produktu");
              },
            },
          );
        }}
      />
    </div>
  );
};

export default EditProduct;
