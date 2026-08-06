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
        <aside
          className="
          flex
          flex-col
          min-h-screen
          w-72
          p-6
          bg-(--surface)
          text-(--foreground)
          border-r
          border-(--border)
        "
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 text-white bg-orange-500">
              <Shield size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>

              <p className="text-sm text-(--foreground-secondary)">
                My IT Store
              </p>
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
                      : "text-(--foreground-secondary) hover:bg-(--surface-secondary)hover:text-(--foreground)"
                  }
                `}
                >
                  <Icon size={20} />

                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div
            className="
            pt-6
            mt-auto
            text-sm
            text-(--foreground-secondary)
            border-t
            border-(--border)
          "
          >
            <p className="mb-4">Panel administracyjny</p>

            <button
              onClick={handleLogout}
              className=" hover:bg-orange-600 w-full px-4 py-2 text-sm font-medium text-white transition bg-orange-500 cursor-pointer"
            >
              Wyloguj
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2
              className="
              text-3xl
              font-bold
              text-(--foreground)
            "
            >
              {menu.find((item) => item.id === tab)?.name}
            </h2>

            <p
              className="
              mt-1
              text-(--foreground-secondary)
            "
            >
              Zarządzaj swoją platformą
            </p>
          </div>

          <div
            className="
            p-6
            bg-(--surface)
            border
            border-(--border)
            shadow-sm
          "
          >
            {render()}
          </div>
        </main>
      </div>
    </>
  );
};
export default AdminDashboard;
