import { OrangeButton } from "../../../components/ui/Buttons";
import { useOrder } from "../../../hooks/useOrders";
import { Link } from "react-router-dom";
import { useImage } from "../../../hooks/useImage";
import LoadingScreen from "../../../components/LoadingScreen";
const OrderDetails = ({ id, onBack }: any) => {
  const { data, isLoading } = useOrder(id);

  if (isLoading) {
    return <LoadingScreen />;
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
        <h2 className="text-3xl font-bold text-(--foreground)">Zamówienie {order.order_number}</h2>

        <p className="mt-1 text-(--foreground-secondary)">Szczegóły zamówienia</p>
      </div>

      <section className="border border-(--border) bg-(--surface)">
        <div className="border-b border-(--border) bg-(--surface-secondary) px-6 py-4">
          <h3 className="text-lg font-semibold text-(--foreground)">Informacje o zamówieniu</h3>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <p className="text-sm text-(--foreground-secondary)">Numer zamówienia</p>

            <p className="font-semibold text-(--foreground)">{order.order_number}</p>
          </div>

          <div>
            <p className="text-sm text-(--foreground-secondary)">Status</p>

            <p className="font-semibold text-(--foreground)">{orderStatusLabels[order.status]}</p>
          </div>

          <div>
            <p className="text-sm text-(--foreground-secondary)">Data</p>

            <p className="text-(--foreground)">{new Date(order.created_at).toLocaleString("pl-PL")}</p>
          </div>

          <div>
            <p className="text-sm text-(--foreground-secondary)">Kwota</p>

            <p className="font-bold text-(--primary)">{Number(order.total_price).toFixed(2)} zł</p>
          </div>
        </div>
      </section>

      <section className="border border-(--border) bg-(--surface)">
        <div className="border-b border-(--border) bg-(--surface-secondary) px-6 py-4">
          <h3 className="text-lg font-semibold text-(--foreground)">Produkty</h3>
        </div>

        {items.map((item: any, index: number) => {
          const product = item.product;
          const seller = item.seller;

          return (
            <div
              key={product.id}
              className={`items-c flex flex-col gap-6 p-6 ${index !== items.length - 1 ? "border-b border-(--border)" : ""} `}
            >
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
                {/* Zdjęcie */}
                <div className="flex h-40 w-full shrink-0 items-center justify-center border border-(--border) bg-(--surface) p-2 sm:h-32 sm:w-32">
                  <img src={useImage(product)} className="h-full w-full object-contain" alt={product.name} />
                </div>

                {/* Informacje o produkcie */}
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-lg font-semibold break-words text-(--foreground) sm:text-xl">{product.name}</h4>

                  <p className="mt-1 truncate text-sm text-(--foreground-secondary) sm:text-base">
                    {product.brand} {product.model}
                  </p>

                  {/* Sprzedawca */}
                  <div className="mt-4 border border-(--border) bg-(--surface-secondary) p-3 sm:p-4">
                    <p className="text-sm text-(--foreground-secondary)">Sprzedawca</p>

                    <Link
                      to={`/seller/${seller.slug}/${seller.seller_id}`}
                      className="mt-1 block truncate font-semibold text-(--foreground) transition hover:text-(--primary)"
                    >
                      {seller.shop_name}
                    </Link>

                    <p className="truncate text-sm text-(--foreground-secondary)">{seller.company_name}</p>

                    {seller.is_verified === 1 && <span className="mt-1 block text-sm text-(--success)">✓ Zweryfikowany sprzedawca</span>}
                  </div>

                  {/* Cena i ilość */}
                  <div className="mt-5 flex flex-col gap-4 border-t border-(--border) pt-4 min-[400px]:flex-row min-[400px]:items-end min-[400px]:justify-between">
                    <div className="text-sm text-(--foreground) sm:text-base">
                      <p>
                        Ilość:
                        <span className="ml-2 font-semibold">{item.quantity}</span>
                      </p>

                      <p className="mt-1">
                        Cena sztuki:
                        <span className="ml-2 font-semibold">{Number(item.price).toFixed(2)} zł</span>
                      </p>
                    </div>

                    <div className="text-left min-[400px]:text-right">
                      <p className="text-sm text-(--foreground-secondary)">Razem</p>

                      <p className="text-lg font-bold text-(--primary) sm:text-xl">{(item.quantity * Number(item.price)).toFixed(2)} zł</p>
                    </div>
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
