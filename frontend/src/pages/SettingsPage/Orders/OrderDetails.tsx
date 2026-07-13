import { OrangeButton } from "../../../components/ui/Buttons";
import { useAuth } from "../../../context/AuthContext";
import { useOrder } from "../../../hooks/useOrders";

const OrderDetails = ({ id, onBack }: any) => {
  const { token } = useAuth();

  const { data, isLoading } = useOrder(id, token);

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div className="space-y-8">
      <OrangeButton onClick={onBack}> Powrót do zamówień</OrangeButton>

      <div>
        <h2 className="text-3xl font-bold">Zamówienie {data.order_number}</h2>

        <p className="text-gray-500 mt-1">Szczegóły złożonego zamówienia</p>
      </div>

      <div className="border border-gray-300">
        <div className="border-b border-gray-300 bg-gray-50 px-6 py-4">
          <h3 className="font-semibold text-lg">Informacje o zamówieniu</h3>
        </div>

        <div className="grid grid-cols-2 gap-y-6 px-6 py-6">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold">{data.status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Data zamówienia</p>
            <p>{new Date(data.created_at).toLocaleString("pl-PL")}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Łączna kwota</p>
            <p className="text-xl font-bold text-orange-500">
              {Number(data.total_price).toFixed(2)} zł
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Liczba produktów</p>
            <p>{data.items.length}</p>
          </div>
        </div>
      </div>

      <div className="border border-gray-300">
        <div className="border-b border-gray-300 bg-gray-50 px-6 py-4">
          <h3 className="font-semibold text-lg">Zamówione produkty</h3>
        </div>

        <div>
          {data.items.map((item: any, index: number) => {
            const product = item.product_data;

            return (
              <div
                key={product.id}
                className={`flex gap-5 p-6 ${
                  index !== data.items.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-28 h-28 object-contain border border-gray-300 p-2"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{product.name}</h4>

                    {product.producer && (
                      <p className="text-gray-500 mt-1">
                        Producent: {product.producer}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-end mt-5">
                    <div className="space-y-1">
                      <p className="text-gray-500">
                        Ilość:{" "}
                        <span className="font-semibold text-black">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="text-gray-500">
                        Cena za sztukę:{" "}
                        <span className="font-semibold text-black">
                          {Number(item.price).toFixed(2)} zł
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Wartość</p>

                      <p className="text-xl font-bold text-orange-500">
                        {(item.quantity * item.price).toFixed(2)} zł
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
