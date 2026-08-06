import ProductForm from "./ProductForm";
import { productCreateSchema } from "../../../../../schemas/productSchema";
import { useSeller } from "../../../../../hooks/useSeller";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const AddProduct = () => {
  const {
    addProduct: { mutate, isSuccess },
    uploadImage,
    getCategories: { data: categories = [] },
    getSubcategories: { data: subcategories = [] },
    getCompanyInfo: { data: sellerData },
  } = useSeller();

  const queryClient = useQueryClient();

  const defaultValues = {
    name: "",
    brand: "",
    model: "",
    description: "",

    price: "",
    stock: "",

    category_id: "",
    subcategory_id: "",
    attributes: [],

    images: [],
  };

  const onSubmit = (data: any) => {
    const productData = {
      name: data.name,
      brand: data.brand,
      model: data.model,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      attributes: data.attributes,
      seller_id: sellerData.seller_id,
    };

    mutate(productData, {
      onSuccess: (product) => {
        if (data.images?.length) {
          const formData = new FormData();

          data.images.forEach((file: File) => {
            formData.append("images", file);
          });

          uploadImage.mutate(
            {
              productId: product.id,
              formData,
            },

            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ["products", "seller-products"],
                });

                queryClient.invalidateQueries({
                  queryKey: ["products"],
                });

                toast.success("Produkt został dodany");
              },

              onError: () => {
                toast.warning(
                  "Produkt dodany, ale zdjęcia nie zostały przesłane"
                );
              },
            }
          );
        } else {
          queryClient.invalidateQueries({
            queryKey: ["products", "seller-products"],
          });

          toast.success("Produkt został dodany");
        }
      },

      onError: () => {
        toast.error("Nie udało się dodać produktu");
      },
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-(--foreground)">
          Dodaj produkt
        </h2>

        <p className="text-(--foreground-secondary)">
          Utwórz nową ofertę w swoim sklepie
        </p>
      </div>

      <ProductForm
        mode="create"
        schema={productCreateSchema}
        isSuccess={isSuccess}
        categories={categories}
        subcategories={subcategories}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AddProduct;
