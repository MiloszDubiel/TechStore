import { useSearchParams } from "react-router-dom";

// import Overview from "./tabs/Overview";
import Users from "./tabs/Users";
// import Sellers from "./tabs/Sellers";
// import Products from "./tabs/Products";
// import Orders from "./tabs/Orders";

const AdminDashboard = () => {
  const [params, setParams] = useSearchParams();

  const tab = params.get("tab") || "overview";

  const render = () => {
    switch (tab) {
      case "users":
        return <Users />;

      case "products":
        return 

      case "sellers":
        return 

      case "orders":
        return 

      default:
        return 
    }
  };

  return (
    <div className="flex">
      <aside className=" w-64 min-h-screen p-5 text-white bg-gray-900">
        <h2 className="mb-8 text-xl font-bold">Panel Admina</h2>

        <button onClick={() => setParams({ tab: "overview" })}>
          Dashboard
        </button>

        <button onClick={() => setParams({ tab: "users" })}>Użytkownicy</button>

        <button onClick={() => setParams({ tab: "products" })}>Produkty</button>

        <button onClick={() => setParams({ tab: "sellers" })}>
          Sprzedawcy
        </button>

        <button onClick={() => setParams({ tab: "orders" })}>Zamówienia</button>
      </aside>

      <main className="flex-1 p-8">{render()}</main>
    </div>
  );
};

export default AdminDashboard;
