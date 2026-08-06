import { Eye } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useAdmin } from "../../../../hooks/useAdmin";
import EditOrder from "./EditOrder";
import Pagination from "../../../../components/ui/Pagination";

const Orders = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<any | null>(null);

  const {
    orders: { data = [] },
  } = useAdmin({
    page: page,
    limit: 10,
    search,
  });

  const orderList = data?.orders ?? [];

  const orderStatusLabels: Record<string, string> = {
    NEW: "Nowe",
    PROCESSING: "W realizacji",
    SHIPPED: "Wysłane",
    COMPLETED: "Zakończone",
    CANCELLED: "Anulowane",
  };

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
        <h1 className="text-2xl font-bold text-(--foreground)">Zamówienia</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj zamówienia..."
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
            {orderList.map((order: any) => (
              <tr key={order.id} className="border-t border-(--border)">
                <td className="p-4 font-semibold">#{order.order_number}</td>

                <td className="p-4">
                  {order.user_name || order.first_name}{" "}
                  {order.user_last_name || order.last_name}
                </td>

                <td className="p-4 text-(--foreground-secondary)">
                  {order.email}
                </td>

                <td className="p-4">
                  {Number(order.total_price).toFixed(2)} zł
                </td>

                <td className="p-4">{order.payment_method}</td>

                <td className="p-4">
                  <span
                    className={
                      order.status === "COMPLETED"
                        ? "text-green-500"
                        : order.status === "CANCELLED"
                        ? "text-red-500"
                        : "text-orange-500"
                    }
                  >
                    {orderStatusLabels[order.status]}
                  </span>
                </td>

                <td className="p-4 text-(--foreground-secondary)">
                  {new Date(order.created_at).toLocaleDateString("pl-PL")}
                </td>

                <td className="p-4">
                  <button
                    className=" hover:text-blue-600 text-blue-500 cursor-pointer"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {orderList.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="
                p-8
                text-center
                text-(--foreground-secondary)
              "
                >
                  Brak zamówień
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
};
export default Orders;
