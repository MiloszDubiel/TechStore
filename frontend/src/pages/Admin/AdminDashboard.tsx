import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutDashboard, Users as UsersIcon, Package, ShoppingCart, Shield } from "lucide-react";

import Users from "./tabs/Users/Users";
import Products from "./tabs/Products/Products";
import Orders from "./tabs/Orders/Orders";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar/Navbar";
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

      case "orders":
        return <Orders />;

      default:
        return <div>Dashboard</div>;
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-(--background)">
        <aside className="flex min-h-screen w-72 flex-col border-r border-(--border) bg-(--surface) p-6 text-(--foreground)">
          <div className="mb-10 flex items-center gap-3">
            <div className="bg-orange-500 p-2 text-white">
              <Shield size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>

              <p className="text-sm text-(--foreground-secondary)">My IT Store</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setParams({ tab: item.id })}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition ${
                    tab === item.id
                      ? "bg-orange-500 text-white"
                      : "hover:bg-(--surface-secondary)hover:text-(--foreground) text-(--foreground-secondary)"
                  } `}
                >
                  <Icon size={20} />

                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-(--border) pt-6 text-sm text-(--foreground-secondary)">
            <p className="mb-4">Panel administracyjny</p>

            <button
              onClick={handleLogout}
              className="w-full cursor-pointer bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Wyloguj
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-(--foreground)">{menu.find((item) => item.id === tab)?.name}</h2>

            <p className="mt-1 text-(--foreground-secondary)">Zarządzaj swoją platformą</p>
          </div>

          <div className="border border-(--border) bg-(--surface) p-6 shadow-sm">{render()}</div>
        </main>
      </div>
    </>
  );
};
export default AdminDashboard;
