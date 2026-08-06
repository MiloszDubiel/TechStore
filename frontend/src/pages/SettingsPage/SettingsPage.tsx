import { useState } from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

import { Addresses } from "./Addresses/Addresses";

import Security from "./Security/Security";
import Preferences from "./Preferences/Preferrences";
import { PersonalData } from "./PersonalData/PersonalData";
import Orders from "./Orders/Orders";
import { Package, User, MapPinned, ShieldCheck, Settings } from "lucide-react";
type Tab =
  | "orders"
  | "order-details"
  | "profile"
  | "addresses"
  | "security"
  | "settings";

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
            <button
              onClick={() => setActiveTab("orders")}
              className="hover:underline mb-4 text-sm text-gray-500"
            >
              ← Powrót
            </button>

            <h2 className="mb-4 text-2xl font-bold">
              Zamówienie #{selectedOrderId}
            </h2>

            <p className="text-gray-500">
              Szczegóły zamówienia (produkty, status, dostawa)
            </p>
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
      <section className="py-14 text-center text-white bg-(--primary)">
        <h1 className="text-4xl font-bold">Moje konto</h1>
        <p className="mt-2">Zarządzaj swoim profilem i zamówieniami</p>
      </section>

      <main className="container grid grid-cols-12 gap-8 px-6 py-10 mx-auto">
        <aside className="h-fit col-span-3 bg-(--surface) shadow-md">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex w-full items-center gap-3 border-b border-(--border) p-4 text-left cursor-pointer ${
              activeTab === "orders"
                ? "bg-(--primary) text-white"
                : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <Package size={20} />
            Zamówienia i dane dostaw
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center gap-3 border-b border-(--border) p-4 text-left cursor-pointer ${
              activeTab === "profile"
                ? "bg-(--primary) text-white"
                : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <User size={20} />
            Dane osobowe
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex w-full items-center gap-3 border-b border-(--border) p-4 text-left cursor-pointer ${
              activeTab === "addresses"
                ? "bg-(--primary) text-white"
                : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <MapPinned size={20} />
            Adresy
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex w-full items-center gap-3 border-b border-(--border) p-4 text-left cursor-pointer ${
              activeTab === "security"
                ? "bg-(--primary) text-white"
                : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <ShieldCheck size={20} />
            Bezpieczeństwo
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex w-full items-center gap-3 p-4 text-left cursor-pointer ${
              activeTab === "settings"
                ? "bg-(--primary) text-white"
                : "text-(--foreground) hover:bg-(--surface-secondary)"
            }`}
          >
            <Settings size={20} />
            Ustawienia
          </button>
        </aside>

        <section className="min-h-150 col-span-9 p-6 bg-(--surface) border border-(--border) shadow-md">
          {renderContent()}
        </section>
      </main>
    </>
  );
};

export default AccountPage;
