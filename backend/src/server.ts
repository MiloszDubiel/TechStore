import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productsRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";
import favoriteRoutes from "./routes/favorite.routes";
import reviewsRoutes from "./routes/reviews.routes";
import settingsRoutes from "./routes/settings.routes";
import sellerRoutes from "./routes/seller.routes";
import adminRoutes from "./routes/admin.routes";
import reportRoutes from "./routes/report.routes";
import path from "node:path";
import cors from "cors";
import chatRoutes from "./routes/chat.router";
import notificationRoutes from "./routes/notification.routes";
import { initSocket } from "./socket/indext";
import http from "http";

import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/socket", chatRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/notification", notificationRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

const server = http.createServer(app);

initSocket(server);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

server.listen(5000, "0.0.0.0", () => {
  console.log("HTTP + Socket.IO działa na porcie 5000");
}); //Dla Dockera

// server.listen(5000, () => {
//   console.log("HTTP + Socket.IO działa na porcie 5000");
// });
