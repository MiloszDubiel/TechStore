import { OrangeButton } from "../../../components/ui/Buttons";
import { useOrder } from "../../../hooks/useOrders";
import { Link } from "react-router-dom";
import { useImage } from "../../../hooks/useImage";
const OrderDetails = ({ id, onBack }: any) => {
  const { data, isLoading } = useOrder(id);

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  if (!data) {
    return <p>Nie znaleziono zamówienia</p>;
  }

  const orderStatusLabels: Record<string, string> = {
    NEW: "Nowe",
    PROCESSING: "W realizacji",
    SHIPPED: "Wysłane",
    COMPLETED: "Zakończone",
    CANCELLED: "Anulowane",
  };

  const { order, items } = data;

  return (
    <div className="space-y-8">
      <OrangeButton onClick={onBack}>Powrót do zamówień</OrangeButton>

      <div>
        <h2 className="text-3xl font-bold text-(--foreground)">
          Zamówienie {order.order_number}
        </h2>

        <p className="mt-1 text-(--foreground-secondary)">
          Szczegóły zamówienia
        </p>
      </div>

      <section className="border border-(--border) bg-(--surface)">
        <div className="bg-(--surface-secondary) px-6 py-4 border-b border-(--border)">
          <h3 className="text-lg font-semibold text-(--foreground)">
            Informacje o zamówieniu
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <p className="text-sm text-(--foreground-secondary)">
              Numer zamówienia
            </p>

            <p className="font-semibold text-(--foreground)">
              {order.order_number}
            </p>
          </div>

          <div>
            <p className="text-sm text-(--foreground-secondary)">Status</p>

            <p className="font-semibold text-(--foreground)">
              {orderStatusLabels[order.status]}
            </p>
          </div>

          <div>
            <p className="text-sm text-(--foreground-secondary)">Data</p>

            <p className="text-(--foreground)">
              {new Date(order.created_at).toLocaleString("pl-PL")}
            </p>
          </div>

          <div>
            <p className="text-sm text-(--foreground-secondary)">Kwota</p>

            <p className="font-bold text-(--primary)">
              {Number(order.total_price).toFixed(2)} zł
            </p>
          </div>
        </div>
      </section>

      <section className="border border-(--border) bg-(--surface)">
        <div className="bg-(--surface-secondary) px-6 py-4 border-b border-(--border)">
          <h3 className="text-lg font-semibold text-(--foreground)">
            Produkty
          </h3>
        </div>

        {items.map((item: any, index: number) => {
          const product = item.product;
          const seller = item.seller;

          return (
            <div
              key={product.id}
              className={`
            flex
            gap-6
            p-6
            ${index !== items.length - 1 ? "border-b border-(--border)" : ""}
          `}
            >
              <img
                src={useImage(product)}
                className="object-contain w-32 h-32 border border-(--border)"
                alt={product.name}
              />

              <div className="flex-1">
                <h4 className="text-xl font-semibold text-(--foreground)">
                  {product.name}
                </h4>

                <p className="text-(--foreground-secondary)">
                  {product.brand} {product.model}
                </p>

                <div className="bg-(--surface-secondary) p-4 mt-4 border border-(--border)">
                  <p className="text-sm text-(--foreground-secondary)">
                    Sprzedawca
                  </p>

                  <Link
                    to={`/seller/${seller.slug}/${seller.seller_id}`}
                    className="hover:text-(--primary) block mt-1 font-semibold transition text-(--foreground)"
                  >
                    {seller.shop_name}
                  </Link>

                  <p className="text-sm text-(--foreground-secondary)">
                    {seller.company_name}
                  </p>

                  {seller.is_verified === 1 && (
                    <span className="text-sm text-green-600">
                      ✓ Zweryfikowany sprzedawca
                    </span>
                  )}
                </div>

                <div className="flex justify-between mt-5">
                  <div className="text-(--foreground)">
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
                    <p className="text-sm text-(--foreground-secondary)">
                      Razem
                    </p>

                    <p className="text-xl font-bold text-(--primary)">
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
