import { useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Package,
  Store,
  ShoppingCart,
  Shield,
} from "lucide-react";

import Users from "./tabs/Users/Users";

const AdminDashboard = () => {
  const [params, setParams] = useSearchParams();

  const tab = params.get("tab") || "overview";

  const menu = [
    {
      id: "overview",
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      name: "Użytkownicy",
      icon: UsersIcon,
    },
    {
      id: "products",
      name: "Produkty",
      icon: Package,
    },
    {
      id: "sellers",
      name: "Sprzedawcy",
      icon: Store,
    },
    {
      id: "orders",
      name: "Zamówienia",
      icon: ShoppingCart,
    },
  ];

  const render = () => {
    switch (tab) {
      case "users":
        return <Users />;

      case "products":
        return <div>Produkty</div>;

      case "sellers":
        return <div>Sprzedawcy</div>;

      case "orders":
        return <div>Zamówienia</div>;

      default:
        return <div>Dashboard</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className=" w-72 flex flex-col min-h-screen p-6 text-white bg-gray-900">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-orange-500">
            <Shield size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>

            <p className="text-sm text-gray-400">My IT Store</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setParams({ tab: item.id })}
                className={`
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            transition
            cursor-pointer

            ${
              tab === item.id
                ? "bg-orange-500 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }
          `}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className=" pt-6 mt-auto text-sm text-gray-400 border-t border-gray-800">
          Panel administracyjny
        </div>
      </aside>

      <main className=" flex-1 p-8">
        <div className="mb-8">
          <h2 className=" text-3xl font-bold text-gray-800">
            {menu.find((item) => item.id === tab)?.name}
          </h2>

          <p className="mt-1 text-gray-500">Zarządzaj swoją platformą</p>
        </div>

        <div className=" p-6 bg-white border border-gray-200 shadow-sm">
          {render()}
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
