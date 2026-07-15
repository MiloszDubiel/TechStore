import type { ProductForm } from "../../../../schemas/productSchema";
import ProductForms from "./ProductForm";
type Props = {
  product: ProductForm;
  onBack: () => void;
};
const EditProduct = ({ product, onBack }: Props) => {
  console.log(product);
  return (
    <>
      <button
        onClick={onBack}
        className="focus:ring-2 hover:bg-orange-600 px-4 py-3 text-white bg-orange-500 border-none outline-none cursor-pointer resize-none"
      >
        ← Powrót
      </button>

      <ProductForms mode="edit" defaultValues={product} />
    </>
  );
};

export default EditProduct;
