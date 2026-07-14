import { Search, Eye, PackageCheck } from "lucide-react";
import { useSeller } from "../../hooks/useSeller";


const getStatusClasses = (status: string) => {
  switch (status) {
    case "Oczekuje":
      return "bg-yellow-100 text-yellow-700";

    case "W realizacji":
      return "bg-blue-100 text-blue-700";

    case "Wysłane":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Orders = () => {
  const {
    orders: { data = [] },
  } = useSeller();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Zamówienia</h2>

          <p className="text-gray-500">Zarządzaj zamówieniami klientów</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300">
          <Search size={20} className="text-gray-400" />

          <input
            type="text"
            placeholder="Szukaj zamówienia..."
            className="w-full outline-none"
          />
        </div>
      </div>

      <div className=" overflow-x-auto border border-gray-300">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Nr zamówienia</th>
              <th className="p-4">Klient</th>
              <th className="p-4">Data</th>
              <th className="p-4">Kwota</th>
              <th className="p-4">Status</th>
              <th className="p-4">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 border-t border-gray-300"
                >
                  <td className="p-4 font-medium">{order.id}</td>

                  <td className="p-4">{order.customer}</td>

                  <td className="p-4">{order.date}</td>

                  <td className="p-4">{order.total} zł</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button className="hover:text-blue-800 text-blue-600">
                        <Eye size={18} />
                      </button>

                      <button className="hover:text-green-800 text-green-600">
                        <PackageCheck size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <td className="p-4 text-center" colSpan={6}>
                Brak zamówień
              </td>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Orders;
