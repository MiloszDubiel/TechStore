import { io } from "./server";
import { connection } from "./config/db.config";
import { createMessageService } from "./services/chat.services";

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  socket.on("sendMessage", async (data) => {
    /*
            data:

            {
              conversationId:1,
              senderId:15,
              message:"Czy aktualne?"
            }

            */

    const message = await createMessageService(data);

    io.to(`conversation_${data.conversationId}`).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
  });
});
