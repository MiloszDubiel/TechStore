import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Filter,
  Euro,
  Tag,
  PackageCheck,
  Star,
  Truck,
  RotateCcw,
  Search,
  BadgePercent,
} from "lucide-react";

interface FiltersSidebarProps {
  categories?: string[];
  brands?: string[];
}

const FiltersSidebar = ({

  brands = [],
}: FiltersSidebarProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategories,] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",") || []
  );
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");
  const [inStock, setInStock] = useState(searchParams.get("stock") === "1");
  const [rating, setRating] = useState(searchParams.get("rating") || "");


  const updateURL = () => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategories.length)
      params.set("categories", selectedCategories.join(","));
    else params.delete("categories");

    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    else params.delete("brands");

    min ? params.set("min", min) : params.delete("min");
    max ? params.set("max", max) : params.delete("max");

    inStock ? params.set("stock", "1") : params.delete("stock");
    rating ? params.set("rating", rating) : params.delete("rating");

    params.set("page", "1");

    navigate(`/offers?${params.toString()}`);
  };

  const toggleValue = (
    value: string,
    state: string[],
    setter: (v: string[]) => void
  ) => {
    if (state.includes(value)) {
      setter(state.filter((v) => v !== value));
    } else {
      setter([...state, value]);
    }
  };

  const resetFilters = () => {
    navigate("/offers");
  };



  const [freeDelivery, setFreeDelivery] = useState(false);
  const [condition, setCondition] = useState("");
  return (
    <aside className="w-72 space-y-7 p-5 bg-white border border-gray-200 shadow-sm">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={22} className="text-orange-500" />

          <h2 className="text-xl font-bold">Filtry</h2>
        </div>

        {(selectedCategories.length ||
          selectedBrands.length ||
          min ||
          max ||
          rating ||
          inStock ||
          freeDelivery ||
          condition) && (
          <span className=" px-3 py-1 text-xs text-white bg-orange-500 ">
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
            className=" focus:border-orange-500 w-full px-3 py-2 border border-gray-200  outline-none"
          />

          <input
            type="number"
            placeholder="Do"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className=" focus:border-orange-500 w-full px-3 py-2 border border-gray-200  outline-none"
          />
        </div>
      </div>

      {/* Marka */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag size={18} className="text-orange-500" />

          <h3 className="font-semibold">Marka</h3>
        </div>

        <div className="max-h-40 space-y-2 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand}
              className=" hover:text-orange-500 flex items-center gap-3 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() =>
                  toggleValue(brand, selectedBrands, setSelectedBrands)
                }
                className=" accent-orange-500 w-4 h-4"
              />

              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Stan produktu */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <PackageCheck size={18} className="text-orange-500" />

          <h3 className="font-semibold">Stan</h3>
        </div>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className=" w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
        >
          <option value="">Wszystkie</option>

          <option value="new">Nowy</option>

          <option value="used">Używany</option>

          <option value="refurbished">Odnowiony</option>
        </select>
      </div>

      {/* Dostępność */}
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

      {/* Dostawa */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Truck size={18} className="text-orange-500" />

          <h3 className="font-semibold">Dostawa</h3>
        </div>

        <label className=" flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={freeDelivery}
            onChange={() => setFreeDelivery(!freeDelivery)}
            className=" accent-orange-500 w-4 h-4"
          />
          Darmowa dostawa
        </label>
      </div>

      {/* Ocena */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star size={18} className="text-orange-500" />

          <h3 className="font-semibold">Ocena</h3>
        </div>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className=" w-full px-3 py-2 border border-gray-200 rounded-lg"
        >
          <option value="">Dowolna</option>

          <option value="4">⭐ 4+</option>

          <option value="3">⭐ 3+</option>

          <option value="2">⭐ 2+</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={updateURL}
          className=" hover:bg-orange-600 flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition bg-orange-500 rounded-lg cursor-pointer"
        >
          <Search size={18} />
          Wyszukaj
        </button>

        <button
          onClick={resetFilters}
          className=" hover:bg-gray-50 flex items-center justify-center w-full gap-2 py-3 transition border border-gray-200 rounded-lg cursor-pointer"
        >
          <RotateCcw size={18} />
          Resetuj
        </button>
      </div>
    </aside>
  );
};
export default FiltersSidebar;
