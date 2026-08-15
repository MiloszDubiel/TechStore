import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./RegisterPage";
import { renderWithProviders } from "../../test/utils/test-utils";
import { describe, expect, it } from "vitest";

describe("RegisterPage tests ", () => {
  beforeEach(() => {
    renderWithProviders(<RegisterPage />);
  });

  it("renders register inputs", () => {
    expect(screen.getByLabelText("Imię")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasło")).toBeInTheDocument();
    expect(screen.getByLabelText("Powtórz hasło")).toBeInTheDocument();
  });

  it("hide validation info when hasło is valid", async () => {
    await userEvent.click(screen.getByRole("button", { name: /zarejestruj/i }));
    await userEvent.type(screen.getByLabelText("Hasło"), "!QAZxsw2");

    const error = document.getElementById("password")?.nextElementSibling;

    expect(error).toBeNull();
  });

  it("show error when user exists ", async () => {
    await userEvent.type(screen.getByLabelText("Imię"), "Miłosz");
    await userEvent.type(screen.getByLabelText("Email"), "milosz@example.com");
    await userEvent.type(screen.getByLabelText("Hasło"), "!QAZxsw2");
    await userEvent.type(screen.getByLabelText("Powtórz hasło"), "!QAZxsw2");

    await userEvent.click(screen.getByRole("button", { name: /zarejestruj/i }));

    expect(await screen.findByText(/Użytkownik już istnieje/i)).toBeInTheDocument();
  });
});
