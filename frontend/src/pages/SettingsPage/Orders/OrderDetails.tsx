import { OrangeButton } from "../../../components/ui/Buttons";
import { useAuth } from "../../../context/AuthContext";
import { useOrder } from "../../../hooks/useOrders";
import { Link } from "react-router-dom";

const OrderDetails = ({ id, onBack }: any) => {
  const { token } = useAuth();
  const { data, isLoading } = useOrder(id, token);

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  if (!data) {
    return <p>Nie znaleziono zamówienia</p>;
  }

  const { order, items } = data;

  const imageUrl = (productId: number, image: string, seller_id: string) =>
    `${
      import.meta.env.VITE_API_URL
    }uploads/products/${seller_id}/${productId}/${image}`;

  return (
    <div className="space-y-8">
      <OrangeButton onClick={onBack}>Powrót do zamówień</OrangeButton>

      <div>
        <h2 className="text-3xl font-bold">Zamówienie {order.order_number}</h2>

        <p className="mt-1 text-gray-500">Szczegóły zamówienia</p>
      </div>

      {/* INFORMACJE */}

      <section className="border border-gray-300">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold">Informacje o zamówieniu</h3>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <p className="text-sm text-gray-500">Numer zamówienia</p>

            <p className="font-semibold">{order.order_number}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>

            <p className="font-semibold">{order.status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Data</p>

            <p>{new Date(order.created_at).toLocaleString("pl-PL")}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Kwota</p>

            <p className="font-bold text-orange-500">
              {Number(order.total_price).toFixed(2)} zł
            </p>
          </div>
        </div>
      </section>

      <section className="border border-gray-300">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold">Produkty</h3>
        </div>

        {items.map((item: any, index: number) => {
          const product = item.product;
          const seller = item.seller;

          console.log(`/seller/${seller.slug}/${seller.seller_id}`);

          return (
            <div
              key={product.id}
              className={`flex gap-6 p-6 ${
                index !== items.length - 1 ? "border-b border-gray-300" : ""
              }`}
            >
              <img
                src={
                  product.images?.length
                    ? imageUrl(
                        product.id,
                        product.images[0].image,
                        seller.seller_id
                      )
                    : "/no-image.png"
                }
                className="object-contain w-32 h-32 border border-gray-300"
                alt={product.name}
              />

              <div className="flex-1">
                <h4 className="text-xl font-semibold">{product.name}</h4>

                <p className="text-gray-500">
                  {product.brand} {product.model}
                </p>

                <div className="bg-gray-50 p-4 mt-4 border border-gray-300">
                  <p className="text-sm text-gray-500">Sprzedawca</p>

                  <Link
                    to={`/seller/${seller.slug}/${seller.seller_id}`}
                    className="hover:text-orange-500 block mt-1 font-semibold transition"
                  >
                    {seller.shop_name}
                  </Link>

                  <p className="text-sm text-gray-600">{seller.company_name}</p>

                  {seller.is_verified === 1 && (
                    <span className="text-sm text-green-600">
                      ✓ Zweryfikowany sprzedawca
                    </span>
                  )}
                </div>

                {/* CENA */}

                <div className="flex justify-between mt-5">
                  <div>
                    <p>
                      Ilość:
                      <span className="ml-2 font-semibold">
                        {item.quantity}
                      </span>
                    </p>

                    <p>
                      Cena sztuki:
                      <span className="ml-2 font-semibold">
                        {Number(item.price).toFixed(2)} zł
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Razem</p>

                    <p className="text-xl font-bold text-orange-500">
                      {(item.quantity * Number(item.price)).toFixed(2)} zł
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default OrderDetails;
