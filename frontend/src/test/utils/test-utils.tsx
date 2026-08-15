import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "../../context/AuthContext";
import { ThemeProvider } from "../../context/ThemeProvider";
import { FavoriteProvider } from "../../context/FavoritesContext";
import { MemoryRouter } from "react-router-dom";
import { NotificationProvider } from "../../context/NotificationContext";

export const renderWithProviders = (ui: ReactNode, initialEntries = ["/"]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>
              <FavoriteProvider>{ui}</FavoriteProvider>
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};
