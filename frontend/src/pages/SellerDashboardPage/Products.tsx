import { Search, Edit, Trash2, Plus } from "lucide-react";
import { useSeller } from "../../hooks/useSeller";
import EditProduct from "./tabs/Products/EditProduct";
import { useState } from "react";
import ConfirmModal from "../../components/ui/ConfirmModal";
import NotificationCard from "../../components/ui/NotificationCard";
const Products = () => {
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productData, setProductData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const {
    products: { data = [] },
    deleteProduct: { mutate, isSuccess },
  } = useSeller();

  if (editingProduct) {
    return (
      <EditProduct
        product={editingProduct}
        onBack={() => setEditingProduct(null)}
      />
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Produkty w sprzedaży</h2>

          <p className="text-gray-500">Zarządzaj produktami w swoim sklepie</p>
        </div>

        <button className=" hover:bg-orange-600 flex items-center gap-2 px-4 py-2 text-white bg-orange-500">
          <Plus size={18} />
          Dodaj produkt
        </button>
      </div>

      <div className="mb-6">
        <div className=" flex items-center gap-3 px-4 py-3 border border-gray-300">
          <Search size={20} className="text-gray-400" />

          <input
            placeholder="Szukaj produktu..."
            className=" w-full outline-none"
          />
        </div>
      </div>

      <div className=" overflow-x-auto border border-gray-300">
        {isSuccess && <NotificationCard message={message} />}

        <table className=" w-full text-left">
          <thead className=" bg-gray-100">
            <tr>
              <th className="p-4">Produkt</th>

              <th className="p-4">Cena</th>

              <th className="p-4">Magazyn</th>

              <th className="p-4">Status</th>

              <th className="p-4">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((product: any) => (
                <tr
                  key={product.id}
                  className=" hover:bg-gray-50 border-t border-gray-300"
                >
                  <td className="p-4 font-medium">{product.name}</td>

                  <td className="p-4">{product.price} zł</td>

                  <td className="p-4">{product.stock}</td>

                  <td className="p-4">
                    <span
                      className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    
                    ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                    `}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="hover:text-orange-800 text-orange-600 cursor-pointer"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className=" hover:text-red-800 text-red-600 cursor-pointer"
                        onClick={() => {
                          setIsOpen(true);
                          setProductData(product);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center" colSpan={5}>
                  Brak produktów w magazynie
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={isOpen}
        message={`Czy napewno chcesz usunąć produkt: ${productData?.name}`}
        onConfirm={() => {
          mutate(productData!.id, {
            onSuccess: (data) => setMessage(data.message),
            onError: (data) => setMessage(data.message),
          });
          setIsOpen(false);
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
        title="Usuń"
      />
    </div>
  );
};
export default Products;
