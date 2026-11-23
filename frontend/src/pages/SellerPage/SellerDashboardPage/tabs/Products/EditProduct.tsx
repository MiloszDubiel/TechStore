import { useState } from "react";
import ProductForm from "./ProductForm";
import { productEditSchema } from "../../../../../schemas/productSchema";
import { useSeller } from "../../../../../hooks/useSeller";
import { toast } from "react-toastify";

type Props = {
  product: any;
  onBack: () => void;
};

const EditProduct = ({ product, onBack }: Props) => {
  const [removedExsistingImages, setRemovedExisitngImages] = useState<string[]>([]);

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
          categoryId: String(product.categoryId),
          subcategoryId: String(product.subcategoryId),
          images: product.productData.url,
          removedImages: [],
        }}

        attributes={product.attributes}
        categories={categories}
        subcategories={subcategories}
        existingImages={product.productData}
        onRemoveExisting={(imgUrl: string) => {
          if (imgUrl) {
            setRemovedExisitngImages((prev) => [...prev, imgUrl]);
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
          formData.append("categoryId", data.categoryId);
          formData.append("subcategoryId", data.subcategoryId);
          formData.append("attributes", JSON.stringify(data.attributes));
          formData.append("removedImages", JSON.stringify(removedExsistingImages));

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
