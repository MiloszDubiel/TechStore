import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],

//   server: {
//     host: "0.0.0.0",
//     proxy: {
//       "/api": {
//         target: "http://backend:5000",
//         changeOrigin: true,
//       },
//     },
//   },

//   resolve: {
//     dedupe: ["react", "react-dom"],
//   },
// }); // Dla Dockera

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: "0.0.0.0",
    port: 5173,

    proxy: {
      "/api": {
        target: "http://192.168.0.103:5000",
        changeOrigin: true,
      },
    },
  },

  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
