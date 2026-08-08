import { useState } from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

import { Addresses } from "./Addresses/Addresses";

import Security from "./Security/Security";
import Preferences from "./Preferences/Preferrences";
import { PersonalData } from "./PersonalData/PersonalData";
import Orders from "./Orders/Orders";
import { Package, User, MapPinned, ShieldCheck, Settings } from "lucide-react";
type Tab = "orders" | "order-details" | "profile" | "addresses" | "security" | "settings";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [selectedOrderId] = useState<string | null>(null);

  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <Orders />;

      case "order-details":
        return (
          <div>
            <button onClick={() => setActiveTab("orders")} className="mb-4 text-sm text-gray-500 hover:underline">
              ← Powrót
            </button>

            <h2 className="mb-4 text-2xl font-bold">Zamówienie #{selectedOrderId}</h2>

            <p className="text-gray-500">Szczegóły zamówienia (produkty, status, dostawa)</p>
          </div>
        );

      case "profile":
        return <PersonalData />;

      case "addresses":
        return <Addresses />;
      case "security":
        return <Security />;

      case "settings":
        return <Preferences />;
    }
  };

  if (!user?.id) {
    return <>Brak dostępu</>;
  }
  return (
    <>
      <Navbar />
      <section className="bg-(--primary) py-14 text-center text-white">
        <h1 className="text-4xl font-bold">Moje konto</h1>
        <p className="mt-2">Zarządzaj swoim profilem i zamówieniami</p>
      </section>

      <main className="mx-auto flex flex-col gap-8 lg:container lg:grid lg:grid-cols-12 lg:px-6 lg:py-10">
        <aside className="flex h-fit w-auto overflow-x-auto bg-(--surface) shadow-md lg:col-span-3 lg:grid">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex w-full cursor-pointer items-center gap-3 border-t-3 border-b border-(--border) p-4 text-(--foreground) ${
              activeTab === "orders" ? "bg-(--primary) text-white" : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <Package size={20} />
            Zamówienia i dane dostaw
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`text-(--foreground)t flex w-full cursor-pointer items-center gap-3 border-t-3 border-b border-(--border) p-4 ${
              activeTab === "profile" ? "bg-(--primary) text-white" : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <User size={20} />
            Dane osobowe
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex w-full cursor-pointer items-center gap-3 border-t-3 border-b border-(--border) p-4 text-(--foreground) ${
              activeTab === "addresses" ? "bg-(--primary) text-white" : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <MapPinned size={20} />
            Adresy
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex w-full cursor-pointer items-center gap-3 border-t-3 border-b border-(--border) p-4 text-(--foreground) ${
              activeTab === "security" ? "bg-(--primary) text-white" : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <ShieldCheck size={20} />
            Bezpieczeństwo
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex w-full cursor-pointer items-center gap-3 border-t-3 border-b border-(--border) p-4 text-(--foreground) ${
              activeTab === "settings" ? "bg-(--primary) text-white" : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <Settings size={20} />
            Ustawienia
          </button>
        </aside>

        <section className="col-span-9 min-h-150 border border-(--border) bg-(--surface) p-6 shadow-md">{renderContent()}</section>
      </main>
    </>
  );
};

export default AccountPage;
