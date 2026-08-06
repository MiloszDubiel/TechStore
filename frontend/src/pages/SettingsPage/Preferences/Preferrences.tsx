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
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-(--foreground)">
        Preferencje konta
      </h2>

      <p className="mb-6 text-(--foreground-secondary)">
        Zarządzaj ustawieniami swojej aplikacji
      </p>

      <div className="max-w-xl space-y-6">
        <section className="p-4 border border-(--border) bg-(--surface)">
          <h3 className="mb-3 font-semibold text-(--foreground)">
            Wygląd aplikacji
          </h3>

          <label className="block mb-2 text-sm text-(--foreground-secondary)">
            Motyw
          </label>

          <select
            value={settings.theme}
            onChange={(e) => updateSetting("theme", e.target.value)}
            className="
          w-full
          p-3
          border
          border-(--border)
          bg-(--surface)
          text-(--foreground)
          outline-none
          focus:border-(--primary)
        "
          >
            <option value="light">Jasny</option>

            <option value="dark">Ciemny</option>

            <option value="system">Systemowy</option>
          </select>
        </section>

        <section className="p-4 border border-(--border) bg-(--surface)">
          <h3 className="mb-3 font-semibold text-(--foreground)">
            Powiadomienia
          </h3>

          <label className="flex items-center justify-between mb-3 text-(--foreground)">
            <span>Newsletter</span>

            <input
              type="checkbox"
              checked={settings.newsletter}
              onChange={(e) => updateSetting("newsletter", e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between mb-3 text-(--foreground)">
            <span>Promocje i rabaty</span>

            <input
              type="checkbox"
              checked={settings.marketing}
              onChange={(e) => updateSetting("marketing", e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between text-(--foreground)">
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
        hover:bg-(--primary-hover)
        w-full
        py-3
        text-white
        transition
        bg-(--primary)
      "
        >
          Zapisz ustawienia
        </button>
      </div>
    </div>
  );
};
export default Preferences;
