import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";

import { useState } from "react";

import { useAdmin } from "../../../../hooks/useAdmin";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Pagination from "../../../../components/ui/Pagination";

import EditProduct from "./EditProduct";

const Products = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmData, setConfirmData] = useState({
    title: "",
    message: "",
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const {
    products: { data = [] },
    hideProduct,
    showProduct,
    deleteProduct,
  } = useAdmin({
    page: page,
    limit: 10,
    search,
  });

  const productList = data?.products ?? [];

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
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-(--foreground)">Produkty</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj..."
          className="
        px-4 py-2
        border border-(--border)
        bg-(--input)
        text-(--foreground)
        outline-none
        focus:border-orange-500
      "
        />
      </div>

      <div
        className="
      overflow-hidden
      bg-(--surface)
      border border-(--border)
    "
      >
        <table className="w-full text-left text-(--foreground)">
          <thead className="bg-(--surface-secondary)">
            <tr>
              <th className="p-4">Produkt</th>
              <th className="p-4">Sklep</th>
              <th className="p-4">Sprzedawca</th>
              <th className="p-4">Cena</th>
              <th className="p-4">Status</th>
              <th className="p-4">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {productList.map((product: any) => (
              <tr key={product.id} className="border-t border-(--border)">
                <td className="p-4">
                  <p className="font-semibold">{product.name}</p>
                </td>

                <td className="p-4">{product.shop_name}</td>

                <td className="p-4 text-(--foreground-secondary)">
                  {product.email}
                </td>

                <td className="p-4">{product.price} zł</td>

                <td className="p-4">
                  {product.is_deleted ? (
                    <span className="text-red-500">Usunięty</span>
                  ) : product.is_visible ? (
                    <span className="text-green-500">Aktywny</span>
                  ) : (
                    <span className="text-orange-500">Ukryty</span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      className=" hover:text-blue-600 text-blue-500 cursor-pointer"
                      onClick={() => {
                        setEditingProduct(product);
                      }}
                    >
                      <Edit size={18} />
                    </button>

                    {product.is_visible ? (
                      <button
                        className=" hover:text-orange-600 text-orange-500 cursor-pointer"
                        onClick={() => {
                          setConfirmData({
                            title: "Ukryć produkt?",
                            message: `Czy na pewno chcesz ukryć produkt "${product.name}"?`,
                          });
                          setConfirmAction(() => () => {
                            hideProduct.mutate(product.id);
                          });
                          setIsOpen(true);
                        }}
                      >
                        <EyeOff size={18} />
                      </button>
                    ) : (
                      <button
                        className=" hover:text-green-600 text-green-500 cursor-pointer"
                        onClick={() => {
                          showProduct.mutate(product.id);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    )}

                    {product.is_deleted != 1 && (
                      <button
                        className=" hover:text-red-600 text-red-500 cursor-pointer"
                        onClick={() => {
                          setConfirmData({
                            title: "Usunąć produkt?",
                            message: `Czy na pewno chcesz usunąć produkt "${product.name}"?`,
                          });
                          setConfirmAction(() => () => {
                            deleteProduct.mutate(product.id);
                          });
                          setIsOpen(true);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={isOpen}
        title={confirmData.title}
        message={confirmData.message}
        onCancel={() => {
          setIsOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={() => {
          confirmAction?.();
          setIsOpen(false);
          setConfirmAction(null);
        }}
      />
    </div>
  );
};
export default Products;
