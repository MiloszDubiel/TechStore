import { Search, Edit, Trash2, Plus } from "lucide-react";
import { useSeller } from "../../hooks/useSeller";

const products = [
  {
    id: 1,
    name: "Laptop Lenovo Legion",
    price: 4999,
    stock: 12,
    status: "Aktywny",
  },
  {
    id: 2,
    name: "Klawiatura mechaniczna",
    price: 299,
    stock: 25,
    status: "Aktywny",
  },
  {
    id: 3,
    name: "Mysz gamingowa",
    price: 159,
    stock: 0,
    status: "Brak",
  },
];

const Products = () => {
  const {
    products: { data },
  } = useSeller();

  console.log(data);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Produkty</h2>

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
            {products.map((product) => (
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
                    <button className=" hover:text-blue-800 text-blue-600">
                      <Edit size={18} />
                    </button>

                    <button className=" hover:text-red-800 text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Products;
