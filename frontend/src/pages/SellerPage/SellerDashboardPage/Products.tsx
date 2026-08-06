import { Search, Edit, Trash2, Plus } from "lucide-react";
import { useSeller } from "../../../hooks/useSeller";
import EditProduct from "./tabs/Products/EditProduct";
import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Pagination from "../../../components/ui/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const getStatus = (product: any) => {
  if (product.is_deleted) {
    return "Usunięty";
  }

  if (!product.is_visible) {
    return "Ukryty";
  }

  if (product.stock <= 0) {
    return "Brak magazynu";
  }

  return "Aktywny";
};

const Products = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productData, setProductData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit") || (0 as any);
  const {
    products: { data = [] },
    deleteProduct: { mutate },
    productsById,
  } = useSeller({
    page: page,
    limit: 10,
    search,
  });

  const { data: selectedProduct } = productsById(editId);

  useEffect(() => {
    if (!editId) {
      setEditingProduct(null);
      return;
    }

    setEditingProduct(selectedProduct?.product?.[0] ?? null);
  }, [editId, selectedProduct]);

  const navigate = useNavigate();

  if (editingProduct) {
    return (
      <EditProduct
        product={editingProduct}
        onBack={() => {
          setEditingProduct(null);

          const params = new URLSearchParams(searchParams);
          params.delete("edit");
          setSearchParams(params);
        }}
      />
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-(--foreground)">
            Produkty w sprzedaży
          </h2>

          <p className="text-(--foreground-secondary)">
            Zarządzaj produktami w swoim sklepie
          </p>
        </div>

        <button
          className="hover:bg-(--primary-hover) flex items-center gap-2 px-4 py-2 text-white bg-(--primary) cursor-pointer"
          onClick={() => {
            navigate("/seller/dashboard?tab=add-product");
          }}
        >
          <Plus size={18} />
          Dodaj produkt
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 px-4 py-3 border border-(--border)">
          <Search size={20} className="text-(--foreground-secondary)" />

          <input
            placeholder="Szukaj produktu..."
            className="w-full outline-none bg-transparent text-(--foreground)"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-(--border)">
        <table className="w-full text-left">
          <thead className="bg-(--surface-secondary)">
            <tr>
              <th className="p-4 text-(--foreground)">Produkt</th>
              <th className="p-4 text-(--foreground)">Cena</th>
              <th className="p-4 text-(--foreground)">Magazyn</th>
              <th className="p-4 text-(--foreground)">Status</th>
              <th className="p-4 text-(--foreground)">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {data.products?.length > 0 ? (
              data.products.map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-(--surface-secondary) border-t border-(--border)"
                >
                  <td className="p-4 font-medium text-(--foreground)">
                    {product.name}
                  </td>

                  <td className="p-4 text-(--foreground)">
                    {product.price} zł
                  </td>

                  <td className="p-4 text-(--foreground)">{product.stock}</td>

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
                      {getStatus(product)}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="hover:text-(--primary-hover) text-(--primary) cursor-pointer"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className="hover:text-red-800 text-red-600 cursor-pointer"
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
                <td
                  className="p-4 text-center text-(--foreground-secondary)"
                  colSpan={5}
                >
                  Brak produktów w magazynie
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
export default Products;
