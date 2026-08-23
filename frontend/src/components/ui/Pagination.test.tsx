import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import Pagination from "./Pagination";
import { renderWithProviders } from "../../test/utils/test-utils";

describe("Pagination tests ", () => {
  const onPageChange = vi.fn();

  it("should call onPageChange with page 2", async () => {
    renderWithProviders(<Pagination page={1} totalPages={2} onPageChange={onPageChange} />);

    const user = userEvent.setup();

    await user.click(screen.getByText("2"));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should disable next button on last page", async () => {
    renderWithProviders(<Pagination page={2} totalPages={2} onPageChange={onPageChange} />);

    expect(screen.getByText("→")).toBeDisabled();
  });
  it("should disable previous button on first page", async () => {
    renderWithProviders(<Pagination page={1} totalPages={2} onPageChange={onPageChange} />);

    expect(screen.getByText("←")).toBeDisabled();
  });

  it("calls onPageChange with next page", async () => {
    renderWithProviders(<Pagination page={1} totalPages={2} onPageChange={onPageChange} />);

    const user = userEvent.setup();

    await user.click(screen.getByText("→"));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
