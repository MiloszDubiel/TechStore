import { useAuth } from "../../../context/AuthContext";
import { useOrders } from "../../../hooks/useOrders";
import { useState } from "react";
import OrderDetails from "./OrderDetails";
import { OrangeButton } from "../../../components/ui/Buttons";

const Orders = () => {
  const { token } = useAuth();
  const { data: orders, isLoading } = useOrders(token);

  console.log(orders);

  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  if (selectedOrder) {
    return (
      <OrderDetails id={selectedOrder} onBack={() => setSelectedOrder(null)} />
    );
  }

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Moje zamówienia</h2>

      <div className="space-y-4">
        {orders.length > 0
          ? orders.map((order: any) => (
              <div
                key={order.id}
                className="border p-5 flex justify-between items-center border-gray-200"
              >
                <div>
                  <p className="font-semibold">Zamówienie #{order.id}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>

                  <p className="text-sm">{order.items_count} produktów</p>

                  <p className="font-bold text-orange-500">
                    {order.total_price} zł
                  </p>
                </div>

                <OrangeButton onClick={() => setSelectedOrder(order.id)}>
                  Szczegóły
                </OrangeButton>
              </div>
            ))
          : "Brak zamówień"}
      </div>
    </>
  );
};

export default Orders;
