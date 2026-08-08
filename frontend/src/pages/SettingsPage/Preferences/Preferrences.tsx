import { useTheme } from "../../../context/ThemeProvider";
const Preferences = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-(--foreground)">Preferencje konta</h2>

      <p className="mb-6 text-(--foreground-secondary)">Zarządzaj ustawieniami swojej aplikacji</p>

      <div className="max-w-xl space-y-6">
        <section className="border border-(--border) bg-(--surface) p-4">
          <h3 className="mb-3 font-semibold text-(--foreground)">Wygląd aplikacji</h3>

          <label className="mb-2 block text-sm text-(--foreground-secondary)">Motyw</label>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
            className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) outline-none focus:border-(--primary)"
          >
            <option value="light">Jasny</option>

            <option value="dark">Ciemny</option>

            <option value="system">Systemowy</option>
          </select>
        </section>
      </div>
    </div>
  );
};
export default Preferences;
