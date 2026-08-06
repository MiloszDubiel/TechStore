import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isRefreshRequest
//     ) {
//       originalRequest._retry = true;

//       try {
//         await api.post("/auth/refresh");

//         return api(originalRequest);
//       } catch (refreshError) {
//         window.location.href = "/login";

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
