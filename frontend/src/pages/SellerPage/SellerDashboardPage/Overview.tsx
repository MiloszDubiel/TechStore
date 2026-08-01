import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";
import { useSeller } from "../../../hooks/useSeller";
import {orderStatusLabels} from "./tabs/Orders/Orders";
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
        <h2 className="text-2xl font-bold">Panel główny</h2>

        <p className="text-gray-500">Podsumowanie Twojego sklepu</p>
      </div>

      <div className="md:grid-cols-2 xl:grid-cols-4 grid grid-cols-1 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="p-6 bg-white border border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
                </div>

                <div className="p-3 text-orange-500 bg-orange-100">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className=" lg:grid-cols-3 grid grid-cols-1 gap-6">
        <div className=" lg:col-span-2 p-6 border border-gray-300">
          <div className=" flex justify-between mb-6">
            <h3 className="text-lg font-semibold">Ostatnie zamówienia</h3>

            <button className=" text-sm text-orange-500">
              <Link to="/seller/dashboard?tab=orders">Zobacz wszystkie</Link>
            </button>
          </div>

          <div className="space-y-4">
            {overview?.lastOrders?.length ? (
              overview?.lastOrders.map((order: any) => (
                <div
                  key={order.order_number}
                  className=" flex items-center justify-between pb-4 border-b border-gray-300"
                >
                  <div>
                    <p className="font-medium">{order.order_number}</p>

                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{order.price}</p>

                    <span className=" text-sm text-gray-500">
                      {orderStatusLabels[order.status]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className=" flex items-center justify-center pb-4">
                <div>
                  <p className="font-medium">Brak nowych zamówień</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className=" p-6 border border-gray-300">
          <h3 className="mb-6 text-lg font-semibold">Szybkie akcje</h3>

          <div className=" space-y-3">
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
