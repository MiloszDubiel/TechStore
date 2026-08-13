import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "../../zustand/states/filterStore";

const mockFilters = {
  min: "500",
  max: "3000",
  selectedFilters: {
    Marka: ["Lenovo", "Dell"],
    RAM: ["8 GB", "16 GB"],
    Procesor: ["Intel Core i5"],
  },
};

describe("Product filters - tests ", () => {
  beforeEach(() => {
    useFilterStore.setState(mockFilters);
  });

  it("should get max and min price", () => {
    expect(useFilterStore.getState().max).toBe("3000");
    expect(useFilterStore.getState().min).toBe("500");
  });

  it("should uncheck Dell in 'Marka' filters and empty procsor filter", () => {
    useFilterStore.getState().toggleFilter("Marka", "Dell");
    useFilterStore.getState().toggleFilter("Procesor", "Intel Core i5");

    expect(useFilterStore.getState().selectedFilters).toEqual({
      Marka: ["Lenovo"],
      RAM: ["8 GB", "16 GB"],
      Procesor: [],
    });
  });
});
