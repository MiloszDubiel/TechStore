import { create } from "zustand";

type FilterState = {
  min: string;
  max: string;
  selectedFilters: Record<string, string[]>;

  setMin: (value: string) => void;
  setMax: (value: string) => void;

  toggleFilter: (label: string, value: string) => void;

  resetFilters: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  min: "",
  max: "",
  selectedFilters: {},

  setMin: (value) => set({ min: value }),

  setMax: (value) => set({ max: value }),

  toggleFilter: (label, value) =>
    set((state) => {
      const current = state.selectedFilters[label] || [];

      return {
        selectedFilters: {
          ...state.selectedFilters,
          [label]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
        },
      };
    }),

  resetFilters: () =>
    set({
      min: "",
      max: "",
      selectedFilters: {},
    }),
}));
