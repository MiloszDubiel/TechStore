import { useState } from "react";

const Preferences = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    language: "pl",
    currency: "PLN",
    marketing: true,
    productAlerts: true,
    newsletter: false,
  });

  const updateSetting = (
    key: keyof typeof settings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    console.log(settings);
    //TODO save settings to backend
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Preferencje konta</h2>

      <p className="mb-6 text-gray-500">
        Zarządzaj ustawieniami swojej aplikacji
      </p>

      <div className="max-w-xl space-y-6">
        <section className="p-4 border border-gray-200">
          <h3 className="mb-3 font-semibold">Wygląd aplikacji</h3>

          <label className=" block mb-2 text-sm text-gray-600">Motyw</label>

          <select
            value={settings.theme}
            onChange={(e) => updateSetting("theme", e.target.value)}
            className="w-full p-3 border border-gray-200"
          >
            <option value="light">Jasny</option>

            <option value="dark">Ciemny</option>

            <option value="system">Systemowy</option>
          </select>
        </section>

        <section className="p-4 border border-gray-200">
          <h3 className="mb-3 font-semibold">Powiadomienia</h3>

          <label className="flex items-center justify-between mb-3">
            <span>Newsletter</span>

            <input
              type="checkbox"
              checked={settings.newsletter}
              onChange={(e) => updateSetting("newsletter", e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between mb-3">
            <span>Promocje i rabaty</span>

            <input
              type="checkbox"
              checked={settings.marketing}
              onChange={(e) => updateSetting("marketing", e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between">
            <span>Powiadomienia o zmianie ceny produktu</span>

            <input
              type="checkbox"
              checked={settings.productAlerts}
              onChange={(e) => updateSetting("productAlerts", e.target.checked)}
            />
          </label>
        </section>

        <button
          onClick={saveSettings}
          className=" hover:bg-orange-600 w-full py-3 text-white transition bg-orange-500"
        >
          Zapisz ustawienia
        </button>
      </div>
    </div>
  );
};
export default Preferences;
