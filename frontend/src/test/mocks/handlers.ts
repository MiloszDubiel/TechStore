import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/auth/login", async () => {
    return HttpResponse.json(
      {
        message: "Nieprawidłowy email lub hasło",
      },
      {
        status: 401,
      },
    );
  }),
  http.post("/api/auth/register", async () => {
    return HttpResponse.json(
      {
        message: "Użytkownik już istnieje",
      },
      {
        status: 400,
      },
    );
  }),
];
