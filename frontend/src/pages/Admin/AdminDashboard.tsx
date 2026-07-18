import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Package,
  ShoppingCart,
  Shield,
} from "lucide-react";

import Users from "./tabs/Users/Users";
import Products from "./tabs/Products/Products";
import { useAuth } from "../../context/AuthContext";
const AdminDashboard = () => {
  const [params, setParams] = useSearchParams();
  const { logout } = useAuth();
  const tab = params.get("tab") || "overview";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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
        return <Products />;

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

        <div className="pt-6 mt-auto text-sm text-gray-400 border-t border-gray-800">
          <p className="mb-4">Panel administracyjny</p>

          <button
            onClick={handleLogout}
            className="hover:bg-orange-600 w-full px-4 py-2 text-sm font-medium text-white transition bg-orange-500 cursor-pointer"
          >
            Wyloguj
          </button>
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
