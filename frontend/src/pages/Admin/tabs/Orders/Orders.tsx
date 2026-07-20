import { Eye } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useAdmin } from "../../../../hooks/useAdmin";
import EditOrder from "./EditOrder";
const Orders = () => {
  const { token } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<any | null>(null);

  const {
    orders: { data = [] },
  } = useAdmin(token!);

  const orderStatusLabels: Record<string, string> = {
    NEW: "Nowe",
    PROCESSING: "W realizacji",
    SHIPPED: "Wysłane",
    COMPLETED: "Zakończone",
    CANCELLED: "Anulowane",
  };

  const filtered = data.filter((order: any) =>
    `${order.customer_name} ${order.customer_last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (selectedOrderId) {
    return (
      <EditOrder
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
      />
    );
  }
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Zamówienia</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj zamówienia..."
          className="px-4 py-2 border border-gray-300"
        />
      </div>

      <div className="overflow-hidden bg-white border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Nr</th>
              <th className="p-4">Klient</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Kwota</th>
              <th className="p-4">Płatność</th>
              <th className="p-4">Status</th>
              <th className="p-4">Data</th>
              <th className="p-4">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order: any) => (
              <tr key={order.id} className="border-t border-gray-200">
                <td className="p-4 font-semibold">#{order.order_number}</td>

                <td className="p-4">
                  {order.user_name || order.first_name}{" "}
                  {order.user_last_name || order.last_name}
                </td>

                <td className="p-4">{order.email}</td>

                <td className="p-4">
                  {Number(order.total_price).toFixed(2)} zł
                </td>

                <td className="p-4">{order.payment_method}</td>

                <td className="p-4">
                  <span
                    className={
                      order.status === "COMPLETED"
                        ? "text-green-600"
                        : order.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-orange-600"
                    }
                  >
                    {orderStatusLabels[order.status]}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(order.created_at).toLocaleDateString("pl-PL")}
                </td>

                <td className="p-4">
                  <button
                    className="text-blue-600"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
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
