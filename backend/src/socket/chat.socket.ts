import { Server, Socket } from "socket.io";
import { createMessageService } from "../services/chat.services";
import { connection } from "../config/db.config";

export const chatSocket = (socket: Socket, io: Server) => {
  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  socket.on("sendMessage", async (data) => {
    const senderId = (socket as any).user.id;

    const message = await createMessageService({
      conversationId: data.conversationId,
      senderId,
      message: data.message,
    });

    io.to(`conversation_${data.conversationId}`).emit("newMessage", message);

    const [conversations]: any = await connection.query(
      `
      SELECT user_id, seller_id
      FROM conversations
      WHERE id = ?
      `,
      [data.conversationId],
    );

    if (!conversations.length) return;

    const conversation = conversations[0];

    const receiverId =
      conversation.user_id === senderId
        ? conversation.seller_id
        : conversation.user_id;

    io.to(`user_${receiverId}`).emit("newNotification", {
      type: "message",
      message,
    });
  });
};
