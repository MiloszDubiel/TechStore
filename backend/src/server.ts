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
import path from "node:path";
import cors from "cors";
import socket from "./socket";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());

app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/socket");

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.listen(5000, () => {
  console.log("Serwer działa na porcie 5000");
});

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
