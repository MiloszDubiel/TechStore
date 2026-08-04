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

    // pobranie uczestników rozmowy
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

    const [rows]: any = await connection.query(
      `
      SELECT COUNT(*) AS unread_count
      FROM messages m
      JOIN conversations c
        ON c.id = m.conversation_id
      WHERE m.is_read = 0
      AND m.sender_id != ?
      AND (
        c.user_id = ?
        OR c.seller_id = ?
      )
      `,
      [receiverId, receiverId, receiverId],
    );

    const unreadCount = rows[0].unread_count;

    //
    io.to(`user_${receiverId}`).emit("newNotification", {
      type: "message",
      unreadCount,
    });
  });
};
