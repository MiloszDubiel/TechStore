import { useAuth } from "../../../context/AuthContext";
import { useOrder } from "../../../hooks/useOrders";

const OrderDetails = ({ id, onBack }: any) => {
  const { token } = useAuth();

  const { data, isLoading } = useOrder(id, token);

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }


  return (
    <>
      <button onClick={onBack} className="mb-6 text-orange-500">
        ← Powrót
      </button>

      <h2 className="text-2xl font-bold mb-6">Zamówienie #{data.id}</h2>

      <div className="border p-5 mb-6">
        <p>Status: {data.status}</p>
        <p>Data: {new Date(data.created_at).toLocaleString()}</p>
        <p>Łącznie: {data.total_price} zł</p>
      </div>

      <h3 className="font-semibold mb-4">Produkty</h3>

      <div className="space-y-4">
        {data.items.map((item: any) => {
          const product = item.product_data;

          return (
            <div key={product.id} className="border p-4 flex gap-4">
              <img src={product.images[0]} className="w-20 h-20 object-cover" />

              <div className="flex-1">
                <p className="font-semibold">{product.name}</p>

                <p>Ilość: {item.quantity}</p>

                <p>{item.price} zł</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default OrderDetails;
