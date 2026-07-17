import ProductForms from "./ProductForm";

const AddProduct = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Dodaj produkt</h2>

        <p className="text-gray-500">Utwórz nową ofertę w swoim sklepie</p>
      </div>

      <ProductForms mode="create" defaultValues={null} />
    </div>
  );
};
export default AddProduct;
