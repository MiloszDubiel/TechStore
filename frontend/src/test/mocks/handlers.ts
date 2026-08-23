import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/auth/login", () => {
    return HttpResponse.json(
      {
        message: "Nieprawidłowy email lub hasło",
      },
      {
        status: 401,
      },
    );
  }),
  http.post("/api/auth/register", () => {
    return HttpResponse.json(
      {
        message: "Użytkownik już istnieje",
      },
      {
        status: 400,
      },
    );
  }),
  http.get("/api/products/filters", () => {
    return HttpResponse.json(
      [
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
      ],

      {
        status: 200,
      },
    );
  }),
];
