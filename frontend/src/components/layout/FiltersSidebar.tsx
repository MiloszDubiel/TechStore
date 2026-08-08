import { useSearchParams } from "react-router-dom";
import { Filter, Euro, RotateCcw, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { api } from "../../axios";
import { useQuery } from "@tanstack/react-query";
interface FilterItem {
  label: string;
  value: string;
  count: number;
}

const FiltersSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [min, setMin] = useState(searchParams.get("min") || "");

  const [max, setMax] = useState(searchParams.get("max") || "");

  const { data: filters = [] } = useQuery({
    queryKey: ["filters"],

    queryFn: async () => {
      const { data } = await api.get("/api/products/filters");

      return data;
    },
  });

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >(() => {
    const result: Record<string, string[]> = {};

    filters.forEach((filter: any) => {
      const values = searchParams.get(filter.label);

      if (values) {
        result[filter.label] = values.split(",");
      }
    });

    return result;
  });

  const groupedFilters = filters.reduce((acc: any, item: any) => {
    if (!acc[item.label]) {
      acc[item.label] = [];
    }

    acc[item.label].push(item);

    return acc;
  }, {} as Record<string, FilterItem[]>);

  const [openFilters, setOpenFilter] = useState<string[]>([]);

  const toggleFilter = (label: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[label] || [];

      return {
        ...prev,

        [label]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    Object.entries(selectedFilters).forEach(([label, values]) => {
      if (values.length) {
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

  const resetFilters = () => {
    setSelectedFilters({});
    setMin("");
    setMax("");

    setSearchParams({});
  };

  console.log(openFilters);

  return (
    <aside
      className="
        sticky
    top-6
    w-80
    max-h-[calc(100vh-1.5rem)]
    overflow-y-auto
    space-y-6
    p-6
    bg-(--surface)
    border
    border-(--border)
    shadow-sm
    "
    >
      <div className="flex items-center gap-3 pb-4 border-b border-(--border) h-auto">
        <Filter size={22} className="text-(--primary)" />

        <h2
          className="
          text-xl
          font-bold
          text-(--foreground)
        "
        >
          Filtry
        </h2>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Euro size={18} className="text-(--primary)" />

          <h3
            className="
            font-semibold
            text-(--foreground)
          "
          >
            Cena
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Od"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="
            w-full
            px-3
            py-2
            text-sm
            bg-(--surface-secondary)
            text-(--foreground)
            placeholder:text-(--foreground-secondary)
            border
            border-(--border)
            outline-none
            transition
            focus:border-(--primary)
          "
          />

          <input
            type="number"
            placeholder="Do"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="
            w-full
            px-3
            py-2
            text-sm
            bg-(--surface-secondary)
            text-(--foreground)
            placeholder:text-(--foreground-secondary)
            border
            border-(--border)
            outline-none
            transition
            focus:border-(--primary)
          "
          />
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedFilters).map(([label, items]: [string, any]) => (
          <div key={label}>
            <h3
              className="
            mb-3
            font-semibold
            text-(--foreground)
            flex
          justify-between
          cursor-pointer 
          "
              onClick={() => {
                const checkIsInList = openFilters?.includes(label);

                if (checkIsInList) {
                  const filter = openFilters?.filter((e) => e !== label);
                  return setOpenFilter(filter);
                }

                setOpenFilter([...openFilters, label]);
              }}
            >
              {label}{" "}
              <ChevronDown
                size={18}
                className={`${
                  openFilters.includes(label) ? "rotate-180" : "rotate-0"
                }`}
              />
            </h3>

            <div
              className={`
    overflow-hidden
    transition-all
    duration-300
    ${
      openFilters.includes(label)
        ? "max-h-44 opacity-100 pr-2 space-y-2 overflow-y-auto"
        : "max-h-0 opacity-0"
    }
  `}
            >
              {items.map((item: any) => (
                <label
                  key={item.value}
                  className="
              group
              flex
              items-center
              justify-between
              cursor-pointer
              px-2
              py-1.5
              text-sm
              transition
              hover:bg-(--surface-secondary)
            "
                >
                  <div className=" flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[label]?.includes(item.value) || false
                      }
                      onChange={() => toggleFilter(label, item.value)}
                      className=" accent-orange-500 w-4 h-4 cursor-pointer"
                    />

                    <span
                      className="
                  text-(--foreground)
                  group-hover:text-(--primary)
                  transition
                "
                    >
                      {item.value}
                    </span>
                  </div>

                  <span
                    className="
                text-xs
                text-(--foreground-secondary)
              "
                  >
                    {item.count}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="
        pt-4
        space-y-3
        border-t
        border-(--border)
      "
      >
        <button
          onClick={applyFilters}
          className="
          flex
          items-center
          justify-center
          gap-2
          w-full
          py-3
          font-semibold
          text-white
          bg-(--primary)
          transition
          hover:bg-(--primary-hover)
          cursor-pointer
        "
        >
          <Search size={18} />
          Szukaj
        </button>

        <button
          onClick={resetFilters}
          className="
          flex
          items-center
          justify-center
          gap-2
          w-full
          py-3
          font-semibold
          text-(--foreground)
          bg-(--surface)
          border
          border-(--border)
          transition
          hover:bg-(--surface-secondary)
          cursor-pointer
        "
        >
          <RotateCcw size={18} />
          Resetuj
        </button>
      </div>
    </aside>
  );
};
export default FiltersSidebar;
