import { useState } from "react";

import { toast } from "react-toastify";
import { productEditSchema } from "../../../../schemas/productSchema";
import ProductForm from "../../../SellerPage/SellerDashboardPage/tabs/Products/ProductForm";
import { useSeller } from "../../../../hooks/useSeller";
import { useAdmin } from "../../../../hooks/useAdmin";
import { ArrowLeft } from "lucide-react";
const ProductEditForm = ({ product, onBack }: any) => {
  const [removedExsistingImages, setRemovedExisitngImages] = useState<string[]>([]);

  const {
    getCategories: { data: categories },
    getSubcategories: { data: subcategories },
  } = useSeller();

  const {
    updateProduct: { mutate: updateProducts },
  } = useAdmin();

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
    formData.append("removedImages", JSON.stringify(removedExsistingImages));
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
      },
    );
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="bg-orange-500 px-4 py-3 text-white hover:bg-orange-600">
        <ArrowLeft />
        Powrót
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
          images: [],
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
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ProductEditForm;
