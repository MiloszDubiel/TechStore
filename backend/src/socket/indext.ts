import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { chatSocket } from "./chat.socket";
import { notificationSocket } from "./notification.socket";

let io: Server;

export const initSocket = (server: ReturnType<typeof createServer>) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket: any, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Brak tokena"));
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

      socket.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch {
      next(new Error("Nieprawidłowy token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Połączono:", socket.id);
    chatSocket(socket, io);
    notificationSocket(socket, io);

    socket.on("disconnect", () => {
      console.log("Rozłączono:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO nie został zainicjalizowany.");
  }

  return io;
};
