import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  Filter,
  Euro,
  Tag,
  PackageCheck,
  RotateCcw,
  Search,
} from "lucide-react";

interface FiltersSidebarProps {
  brands?: string[];
}

const FiltersSidebar = ({ brands = [] }: FiltersSidebarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",") || []
  );

  const [min, setMin] = useState(searchParams.get("min") || "");

  const [max, setMax] = useState(searchParams.get("max") || "");

  const [inStock, setInStock] = useState(searchParams.get("stock") === "1");

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((x) => x !== brand) : [...prev, brand]
    );
  };

  const updateURL = () => {
    const params = new URLSearchParams(searchParams);

    if (selectedBrands.length) {
      params.set("brands", selectedBrands.join(","));
    } else {
      params.delete("brands");
    }

    if (min) {
      params.set("min", min);
    } else {
      params.delete("min");
    }

    if (max) {
      params.set("max", max);
    } else {
      params.delete("max");
    }

    if (inStock) {
      params.set("stock", "1");
    } else {
      params.delete("stock");
    }


    params.set("page", "1");

    setSearchParams(params);
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setMin("");
    setMax("");
    setInStock(false);

    setSearchParams({});
  };

  const active = selectedBrands.length || min || max || inStock;

  return (
    <aside className=" w-72 space-y-7 p-5 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={22} className="text-orange-500" />

          <h2 className="text-xl font-bold">Filtry</h2>
        </div>

        {active && (
          <span className=" px-3 py-1 text-xs text-white bg-orange-500">
            Aktywne
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Euro size={18} className="text-orange-500" />

          <h3 className="font-semibold">Cena</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Od"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className=" w-full px-3 py-2 border border-gray-200 outline-none"
          />

          <input
            type="number"
            placeholder="Do"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className=" w-full px-3 py-2 border border-gray-200 outline-none"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag size={18} className="text-orange-500" />

          <h3 className="font-semibold">Marka</h3>
        </div>

        <div className=" max-h-40 space-y-2 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand}
              className=" flex items-center gap-3 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className=" accent-orange-500 w-4 h-4"
              />

              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <PackageCheck size={18} className="text-orange-500" />

          <h3 className="font-semibold">Dostępność</h3>
        </div>

        <label className=" flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => setInStock(!inStock)}
            className=" accent-orange-500 w-4 h-4"
          />
          Tylko dostępne
        </label>
      </div>

      <div className="space-y-3">
        <button
          onClick={updateURL}
          className=" hover:bg-orange-600 flex items-center justify-center w-full gap-2 py-3 font-semibold text-white bg-orange-500"
        >
          <Search size={18} />
          Szukaj
        </button>

        <button
          onClick={resetFilters}
          className=" flex items-center justify-center w-full gap-2 py-3 border border-gray-200"
        >
          <RotateCcw size={18} />
          Resetuj
        </button>
      </div>
    </aside>
  );
};
export default FiltersSidebar;
