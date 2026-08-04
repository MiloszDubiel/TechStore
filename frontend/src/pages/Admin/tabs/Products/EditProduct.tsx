import { useState } from "react";

import { toast } from "react-toastify";

import { productEditSchema } from "../../../../schemas/productSchema";
import ProductForm from "../../../SellerPage/SellerDashboardPage/tabs/Products/ProductForm";

import { useSeller } from "../../../../hooks/useSeller";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useAuth } from "../../../../context/AuthContext";

type Props = {
  product: any;
};

const ProductEditForm = ({ product, onBack }: any) => {
  const [newImages] = useState<File[]>([]);



  const {
    getCategories: { data: categories },
    getSubcategories: { data: subcategories },
  } = useSeller();

  const {
    updateProduct: { mutate: updateProducts },
  } = useAdmin();

  const getImages = () => {
    if (!product?.images) return [];

    const check = product?.images.some((el: any) => !el.id);
    if (check) return [];

    return product.images.map(
      (img: any) => `${import.meta.env.VITE_API_URL}${img.url}`
    );
  };


  const onSubmit = (data: any) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("seller_id", product.seller_id);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("category_id", data.category_id);
    formData.append("subcategory_id", data.subcategory_id);
    formData.append("attributes", JSON.stringify(data.attributes));
    formData.append("removedImages", JSON.stringify(removedImages));
    data.images?.forEach((file: any) => formData.append("images", file));

    updateProducts(
      {
        id: product.id,
        formData,
      },
      {
        onSuccess: () => {
          toast.success("Produkt został zaktualizowany");

          onBack();
        },

        onError: () => {
          toast.error("Błąd aktualizacji");
        },
      }
    );
  };

  const [removedImages, setRemovedImages] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="hover:bg-orange-600 px-4 py-3 text-white bg-orange-500"
      >
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

          attributes:
            typeof product.attributes === "string"
              ? JSON.parse(product.attributes)
              : product.attributes ?? [],

          images: [],
          existingImages: getImages(),
          removedImages: [],
        }}
        categories={categories}
        subcategories={subcategories}
        existingImages={getImages()}
        onRemoveExisting={(image) => {
          const filename = image.split("/").pop();

          if (filename) {
            setRemovedImages((prev) => [...prev, filename]);
          }
        }}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ProductEditForm;
