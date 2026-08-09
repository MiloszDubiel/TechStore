import { Filter, Euro, RotateCcw, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { api } from "../../axios";
import { useQuery } from "@tanstack/react-query";
interface FilterItem {
  label: string;
  value: string;
  count: number;
}
import { useFilterStore } from "../../zustand/states/filterStore";

const FiltersSidebar = ({ searchParams, setSearchParams }: any) => {
  const { min, max, selectedFilters, setMin, setMax, toggleFilter, resetFilters } = useFilterStore();

  const [openFilters, setOpenFilter] = useState<string[]>([]);

  const { data: filters = [] } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const { data } = await api.get("/api/products/filters");

      return data;
    },
  });

  const groupedFilters = filters.reduce((acc: Record<string, FilterItem[]>, item: FilterItem) => {
    if (!acc[item.label]) {
      acc[item.label] = [];
    }

    acc[item.label].push(item);

    return acc;
  }, {});

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    Object.entries(selectedFilters).forEach(([label, values]: any) => {
      if (values.length > 0) {
        params.set(label, values.join(","));
      } else {
        params.delete(label);
      }
    });

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

    params.set("page", "1");

    setSearchParams(params);
  };

  return (
    <aside
      className={`sticky top-6 hidden h-fit max-h-[calc(100vh-1.5rem)] w-80 border border-(--border) bg-(--surface) p-3 shadow-sm lg:block lg:overflow-y-auto lg:p-6`}
    >
      <div className="m-0 flex h-auto items-center justify-between border-(--border)">
        <div className="flex items-center gap-3">
          <Filter size={22} className="text-(--primary)" />
          <h2 className="text-2xl text-(--foreground)">Filtry</h2>
        </div>
      </div>

      <div className="block">
        <div className="mb-2">
          <div className="mt-4 mb-4 flex items-center gap-2">
            <Euro size={18} className="text-(--primary)" />

            <h3 className="font-semibold text-(--foreground)">Cena</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Od"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full border border-(--border) bg-(--surface-secondary) px-3 py-2 text-sm text-(--foreground) transition outline-none placeholder:text-(--foreground-secondary) focus:border-(--primary)"
            />

            <input
              type="number"
              placeholder="Do"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full border border-(--border) bg-(--surface-secondary) px-3 py-2 text-sm text-(--foreground) transition outline-none placeholder:text-(--foreground-secondary) focus:border-(--primary)"
            />
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedFilters).map(([label, items]: [string, any]) => (
            <div key={label}>
              <h3
                className="mb-3 flex cursor-pointer justify-between font-semibold text-(--foreground)"
                onClick={() => {
                  const checkIsInList = openFilters?.includes(label);

                  if (checkIsInList) {
                    const filter = openFilters?.filter((e) => e !== label);
                    return setOpenFilter(filter);
                  }
                  setOpenFilter([...openFilters, label]);
                }}
              >
                {label} <ChevronDown size={18} className={`${openFilters.includes(label) ? "rotate-180" : "rotate-0"}`} />
              </h3>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFilters.includes(label) ? "max-h-44 space-y-2 overflow-y-auto pr-2 opacity-100" : "max-h-0 opacity-0"
                } `}
              >
                {items.map((item: any) => (
                  <label
                    key={item.value}
                    className="group flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm transition hover:bg-(--surface-secondary)"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedFilters[label]?.includes(item.value) || false}
                        onChange={() => toggleFilter(label, item.value)}
                        className="h-4 w-4 cursor-pointer accent-orange-500"
                      />

                      <span className="text-(--foreground) transition group-hover:text-(--primary)">{item.value}</span>
                    </div>

                    <span className="text-xs text-(--foreground-secondary)">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-(--border) pt-4">
          <button
            onClick={applyFilters}
            className="flex w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) py-3 font-semibold text-white transition hover:bg-(--primary-hover)"
          >
            <Search size={18} />
            Szukaj
          </button>

          <button
            onClick={resetFilters}
            className="flex w-full cursor-pointer items-center justify-center gap-2 border border-(--border) bg-(--surface) py-3 font-semibold text-(--foreground) transition hover:bg-(--surface-secondary)"
          >
            <RotateCcw size={18} />
            Resetuj
          </button>
        </div>
      </div>
    </aside>
  );
};
export default FiltersSidebar;
