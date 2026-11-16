import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils/test-utils";
import FiltersSidebar from "./FiltersSidebar";
import { screen } from "@testing-library/dom";
const mockFilters = [
  {
    label: "Bateria Wh",
    value: "50",
    count: 60,
  },
  {
    label: "Dysk",
    value: "512GB SSD",
    count: 59,
  },
];

describe("FiltersSidebar tests ", () => {
  beforeEach(() => {
    renderWithProviders(<FiltersSidebar />);
  });

  it("Avaiable filters show on the screen", async () => {
    for (const filter of mockFilters) {
      expect(await screen.findByText(filter.label)).toBeInTheDocument();
    }
  });

  it("checks Bateria Wh checkbox", async () => {
    const checkbox = await screen.findByLabelText("50", {
      selector: 'input[type="checkbox"]',
    });
  });
});
