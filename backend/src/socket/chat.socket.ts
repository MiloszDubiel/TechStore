import { Server, Socket } from "socket.io";
import { createMessageService } from "../services/chat.services";

export const chatSocket = (socket: Socket, io: Server) => {
  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  socket.on("sendMessage", async (data) => {
    const message = await createMessageService({
      conversationId: data.conversationId,
      senderId: (socket as any).user.id,
      message: data.message,
    });

    

    io.to(`conversation_${data.conversationId}`).emit("newMessage", message);
  });
};
