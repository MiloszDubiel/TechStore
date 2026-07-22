import { Search, Eye } from "lucide-react";
import { useState } from "react";
import { useSeller } from "../../../../../hooks/useSeller";
import OrderDetails from "./OrderDetails";

const getStatusClasses = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-yellow-100 text-yellow-700";

    case "PROCESSING":
      return "bg-blue-100 text-blue-700";

    case "SHIPPED":
      return "bg-purple-100 text-purple-700";

    case "DELIVERED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};
const orderStatusLabels: Record<string, string> = {
  NEW: "Nowe",
  PROCESSING: "W realizacji",
  SHIPPED: "Wysłane",
  COMPLETED: "Zakończone",
  CANCELLED: "Anulowane",
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const {
    orders: { data = [] },
  } = useSeller();

  if (selectedOrder) {
    return (
      <OrderDetails
        orderId={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Zamówienia</h2>

        <p className="text-gray-500">Zarządzaj zamówieniami klientów</p>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 mb-6 border border-gray-300">
        <Search size={20} className="text-gray-400" />

        <input
          placeholder="Szukaj zamówienia..."
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Numer</th>

              <th className="p-4">Klient</th>

              <th className="p-4">Data</th>

              <th className="p-4">Kwota</th>

              <th className="p-4">Status</th>

              <th className="p-4">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {data.length ? (
              data.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 border-t border-gray-300"
                >
                  <td className="p-4 font-semibold">{order.order_number}</td>

                  <td className="p-4">
                    {order.customer_name || order.name}{" "}
                    {order.last_name || order.customer_last_name}
                  </td>

                  <td className="p-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 font-semibold">{order.total_price} zł</td>

                  <td className="p-4">
                    <span
                      className={`
                    px-3 py-1 rounded-full text-sm
                    ${getStatusClasses(order.status)}
                    `}
                    >
                      {orderStatusLabels[order.status]}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="hover:text-blue-800 text-blue-600"
                    >
                      <Eye size={18} className="cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Brak zamówień
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
