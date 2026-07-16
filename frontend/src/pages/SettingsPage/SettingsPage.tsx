import { useState } from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

import { Addresses } from "./Addresses/Addresses";

import Security from "./Security/Security";
import Preferences from "./Preferences/Preferrences";
import { PersonalData } from "./PersonalData/PersonalData";
import Orders from "./Orders/Orders";

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

  const { token } = useAuth();

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

  if (!token) {
    return <>Brak dostępu</>;
  }
  return (
    <>
      <Navbar />
      <section className="py-14 text-center text-white bg-orange-500">
        <h1 className="text-4xl font-bold">Moje konto</h1>
        <p className="mt-2">Zarządzaj swoim profilem i zamówieniami</p>
      </section>

      <main className="container grid grid-cols-12 gap-8 px-6 py-10 mx-auto">
        <aside className="h-fit  col-span-3 bg-white shadow-md">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "orders" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Zamówienia i dane dostaw
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "profile" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Dane osobowe
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "addresses" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Adresy
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left p-4 border-b border-gray-200 cursor-pointer ${
              activeTab === "security" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Bezpieczeństwo
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left p-4 border-gray-200 cursor-pointer ${
              activeTab === "settings" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Ustawienia
          </button>
        </aside>

        <section className="min-h-150 col-span-9 p-6 bg-white border-gray-200 shadow-md">
          {renderContent()}
        </section>
      </main>
    </>
  );
};

export default AccountPage;
