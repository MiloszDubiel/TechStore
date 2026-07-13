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
    value: string | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    console.log(settings);

   
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Preferencje konta</h2>

      <p className="text-gray-500 mb-6">
        Zarządzaj ustawieniami swojej aplikacji
      </p>

      <div className="max-w-xl space-y-6">
        <section className="border p-4 border-gray-200">
          <h3 className="font-semibold mb-3">Wygląd aplikacji</h3>

          <label className="block text-sm text-gray-600 mb-2 ">Motyw</label>

          <select
            value={settings.theme}
            onChange={(e) => updateSetting("theme", e.target.value)}
            className="w-full border p-3 border-gray-200"
          >
            <option value="light">Jasny</option>

            <option value="dark">Ciemny</option>

            <option value="system">Systemowy</option>
          </select>
        </section>

      
     

    
        <section className="border p-4 border-gray-200">
          <h3 className="font-semibold mb-3">Powiadomienia</h3>

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
          className="
          w-full 
          bg-orange-500 
          text-white 
          py-3
          hover:bg-orange-600
          transition
          "
        >
          Zapisz ustawienia
        </button>
      </div>
    </div>
  );
};

export default Preferences;
