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
import { initSocket } from "./socket/indext";
import http from "http";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/socket", chatRoutes);
app.use("/api/report", reportRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

const server = http.createServer(app);
initSocket(server);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.listen(5000, () => {
  console.log("Serwer działa na porcie 5000");
});
server.listen(5001, () => {
  console.log("Socket działa na 5001");
});
