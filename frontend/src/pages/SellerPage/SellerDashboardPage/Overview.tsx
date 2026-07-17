import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GrayButton, OrangeButton } from "../../../components/ui/Buttons";
import { useSeller } from "../../../hooks/useSeller";

const stats = [
  {
    title: "Przychód",
    value: "12 540 zł",
    icon: TrendingUp,
    change: "+12%",
  },
  {
    title: "Zamówienia",
    value: "156",
    icon: ShoppingCart,
    change: "+8%",
  },
  {
    title: "Produkty",
    value: "48",
    icon: Package,
    change: "+3",
  },
  {
    title: "Klienci",
    value: "320",
    icon: Users,
    change: "+15%",
  },
];

const Overview = () => {
  const navigate = useNavigate();

  const {
    orders: { data = [] },
  } = useSeller();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Panel główny</h2>

        <p className="text-gray-500">Podsumowanie Twojego sklepu</p>
      </div>

      <div className=" md:grid-cols-2 xl:grid-cols-4 grid grid-cols-1 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className=" p-6 bg-white border border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>

                  <div className=" flex items-center gap-1 mt-3 text-sm text-green-600">
                    <ArrowUpRight size={16} />

                    {stat.change}
                  </div>
                </div>

                <div className=" p-3 text-orange-500 bg-orange-100">
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
            {data.length > 0 ? (
              data.map((order: any) => (
                <div
                  key={order.id}
                  className=" flex items-center justify-between pb-4 border-b border-gray-300"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>

                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{order.price}</p>

                    <span className=" text-sm text-gray-500">
                      {order.status}
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
    </div>
  );
};
export default Overview;
