import { Server, Socket } from "socket.io";

export const notificationSocket = (socket: Socket, io: Server) => {
  const userId = (socket as any).user.id;
  socket.join(`user_${userId}`);
};
