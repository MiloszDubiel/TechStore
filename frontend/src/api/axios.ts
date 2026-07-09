import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken") ??
        sessionStorage.getItem("refreshToken");

      const response = await axios.post("/api/auth/refresh", {
        refreshToken,
      });

      const newAccessToken = response.data.accessToken;

      if (localStorage.getItem("refreshToken")) {
        localStorage.setItem("token", newAccessToken);
      } else {
        sessionStorage.setItem("token", newAccessToken);
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;
