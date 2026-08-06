import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";
import { useSeller } from "../../../hooks/useSeller";
import { orderStatusLabels } from "./tabs/Orders/Orders";
const Overview = () => {
  const navigate = useNavigate();

  const {
    getOverview: { data: overview },
  } = useSeller();

  const stats = [
    {
      title: "Przychód",
      value: `${Number(overview?.revenue ?? 0).toFixed(2)} zł`,
      icon: TrendingUp,
    },
    {
      title: "Zamówienia",
      value: overview?.orders ?? 0,
      icon: ShoppingCart,
    },
    {
      title: "Produkty",
      value: overview?.products ?? 0,
      icon: Package,
    },
    {
      title: "Klienci",
      value: overview?.customers ?? 0,
      icon: Users,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-(--foreground)">Panel główny</h2>

        <p className="text-(--foreground-secondary)">
          Podsumowanie Twojego sklepu
        </p>
      </div>

      <div className="md:grid-cols-2 xl:grid-cols-4 grid grid-cols-1 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="p-6 bg-(--surface) border border-(--border)"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-(--foreground-secondary)">
                    {stat.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-(--foreground)">
                    {stat.value}
                  </h3>
                </div>

                <div className="p-3 text-orange-500 bg-orange-100">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:grid-cols-3 grid grid-cols-1 gap-6">
        <div className="lg:col-span-2 p-6 bg-(--surface) border border-(--border)">
          <div className="flex justify-between mb-6">
            <h3 className="text-lg font-semibold text-(--foreground)">
              Ostatnie zamówienia
            </h3>

            <button className="text-sm text-orange-500">
              <Link to="/seller/dashboard?tab=orders">Zobacz wszystkie</Link>
            </button>
          </div>

          <div className="space-y-4">
            {overview?.lastOrders?.length ? (
              overview.lastOrders.map((order: any) => (
                <div
                  key={order.order_number}
                  className="flex items-center justify-between pb-4 border-b border-(--border)"
                >
                  <div>
                    <p className="font-medium text-(--foreground)">
                      {order.order_number}
                    </p>

                    <p className="text-sm text-(--foreground-secondary)">
                      {order.customer}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-(--foreground)">
                      {order.price}
                    </p>

                    <span className="text-sm text-(--foreground-secondary)">
                      {orderStatusLabels[order.status]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center pb-4">
                <div>
                  <p className="font-medium text-(--foreground)">
                    Brak nowych zamówień
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-(--surface) border border-(--border)">
          <h3 className="mb-6 text-lg font-semibold text-(--foreground)">
            Szybkie akcje
          </h3>

          <div className="space-y-3">
            <OrangeButton
              onClick={() => navigate("/seller/dashboard?tab=add-product")}
            >
              Dodaj Produkt
            </OrangeButton>

            <GrayButton
              onClick={() => navigate("/seller/dashboard?tab=orders")}
            >
              Zarządzaj zamówieniami
            </GrayButton>

            <GrayButton
              onClick={() => navigate("/seller/dashboard?tab=settings")}
            >
              Ustawienia sklepu
            </GrayButton>
          </div>
        </div>
      </div>
    </>
  );
};
export default Overview;
