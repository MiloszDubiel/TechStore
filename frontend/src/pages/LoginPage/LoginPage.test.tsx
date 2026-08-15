import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import { renderWithProviders } from "../../test/utils/test-utils";
import { describe, expect, it } from "vitest";

describe("LoginForm", () => {
  beforeEach(() => {
    renderWithProviders(<LoginPage />);
  });

  it("renders email and password inputs", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /zaloguj/i })).toBeInTheDocument();
  });

  it("shows validation errors when form is submitted empty", async () => {
    await userEvent.click(screen.getByRole("button", { name: /zaloguj/i }));

    expect(screen.getByText(/Niepoprawny email/i)).toBeInTheDocument();
    expect(screen.getByText(/Hasło jest wymagane/i)).toBeInTheDocument();
  });

  it("shows error when login fails", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "test@test.pl");

    await user.type(screen.getByLabelText(/hasło/i), "Password123");

    await user.click(
      screen.getByRole("button", {
        name: /zaloguj/i,
      }),
    );

    expect(await screen.findByText(/Nieprawidłowy email lub hasło/i)).toBeInTheDocument();
  });
});
