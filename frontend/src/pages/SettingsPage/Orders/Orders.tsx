import { useOrders } from "../../../hooks/useOrders";
import { useState } from "react";
import OrderDetails from "./OrderDetails";
import { OrangeButton } from "../../../components/ui/Buttons";
import LoadingScreen from "../../../components/LoadingScreen";

const Orders = () => {
  const { data: orders, isLoading } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  if (selectedOrder) {
    return <OrderDetails id={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold text-(--foreground)">Moje zamówienia</h2>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <div key={order.id} className="flex items-center justify-between border border-(--border) bg-(--surface) p-5">
              <div>
                <p className="font-semibold text-(--foreground)">Zamówienie {order.order_number}</p>

                <p className="text-sm text-(--foreground-secondary)">{new Date(order.created_at).toLocaleDateString()}</p>

                <p className="text-sm text-(--foreground)">{order.items_count} produktów</p>

                <p className="font-bold text-(--primary)">{order.total_price} zł</p>
              </div>

              <OrangeButton onClick={() => setSelectedOrder(order.id)}>Szczegóły</OrangeButton>
            </div>
          ))
        ) : (
          <p className="p-8 text-center text-(--foreground-secondary)">Brak zamówień</p>
        )}
      </div>
    </>
  );
};

export default Orders;
