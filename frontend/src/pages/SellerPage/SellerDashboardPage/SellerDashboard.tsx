import { useSearchParams } from "react-router-dom";
import Products from "./Products";
import Orders from "./tabs/Orders/Orders";
import AddProduct from "./tabs/Products/AddProduct";
import SellerSettings from "./SellerSettings";
import Overview from "./Overview";

import {
  Package,
  ShoppingCart,
  Plus,
  Settings,
  BarChart3,
  Store,
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar/Navbar";

const tabs = [
  {
    id: "overview",
    name: "Panel główny",
    icon: Store,
  },
  {
    id: "products",
    name: "Produkty w sprzedaży",
    icon: Package,
  },
  {
    id: "orders",
    name: "Zamówienia",
    icon: ShoppingCart,
  },
  {
    id: "add-product",
    name: "Dodaj produkt do sprzedaży",
    icon: Plus,
  },
  {
    id: "analytics",
    name: "Statystyki",
    icon: BarChart3,
  },
  {
    id: "settings",
    name: "Ustawienia sklepu",
    icon: Settings,
  },
];

const SellerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";

  const changeTab = (tab: string) => {
    setSearchParams({
      tab,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products />;

      case "orders":
        return <Orders />;

      case "add-product":
        return <AddProduct />;

      case "settings":
        return <SellerSettings />;

      default:
        return <Overview />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <section className=" py-14 text-center text-white bg-orange-500">
          <h1 className="text-4xl font-bold">Panel sprzedawcy</h1>

          <p className="mt-2">Zarządzaj swoim sklepem</p>
        </section>

        <main className=" container grid grid-cols-12 gap-8 px-6 py-10 mx-auto">
          <aside className=" h-fit col-span-3 bg-white shadow">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => changeTab(tab.id)}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    p-4
                    border-b
                    border-gray-200
                    cursor-pointer
                    
                    ${
                      activeTab === tab.id
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon size={20} />

                  {tab.name}
                </button>
              );
            })}
          </aside>

          <section className="col-span-9 p-6 bg-white border border-gray-300 shadow">
            {renderContent()}
          </section>
        </main>
      </div>
    </>
  );
};
export default SellerDashboard;
