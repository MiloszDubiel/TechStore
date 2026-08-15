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

  console.log(data);

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-(--foreground)">Produkty w sprzedaży</h2>

          <p className="text-(--foreground-secondary)">Zarządzaj produktami w swoim sklepie</p>
        </div>

        <button
          className="flex cursor-pointer items-center gap-2 bg-(--primary) px-4 py-2 text-white hover:bg-(--primary-hover)"
          onClick={() => {
            navigate("/seller/dashboard?tab=add-product");
          }}
        >
          <Plus size={18} />
          Dodaj produkt
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 border border-(--border) px-4 py-3">
          <Search size={20} className="text-(--foreground-secondary)" />

          <input placeholder="Szukaj produktu..." className="w-full bg-transparent text-(--foreground) outline-none" />
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
                <tr key={product.id} className="border-t border-(--border) hover:bg-(--surface-secondary)">
                  <td className="p-4 font-medium text-(--foreground)">{product.name}</td>

                  <td className="p-4 text-(--foreground)">{product.price} zł</td>

                  <td className="p-4 text-(--foreground)">{product.stock}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                       !product.is_deleted || (product.stock  < 0) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      } `}
                    >
                      {getStatus(product)}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="cursor-pointer text-(--primary) hover:text-(--primary-hover)"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className="cursor-pointer text-red-600 hover:text-red-800"
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
                <td className="p-4 text-center text-(--foreground-secondary)" colSpan={5}>
                  Brak produktów w magazynie
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
        <ConfirmModal
          isOpen={isOpen}
          message={"Czy chcesz usunąć produkt? "}
          title="Czy usunąć?"
          onConfirm={() => {
            mutate(productData.id);
            setIsOpen(false);
            toast.success("Usunięto produkt");
          }}
          onCancel={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
};
export default Products;
