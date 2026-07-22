import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { chatSocket } from "./chat.socket";

export let io: Server;

export const initSocket = (server: HttpServer) => {
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
    } catch (error) {
      next(new Error("Nieprawidłowy token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Połączono socket:", socket.id);
    chatSocket(socket, io);
  });
};
