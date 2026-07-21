import { io } from "./server";
import { connection } from "./config/db.config";
import { Request, Response } from "express";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return;
    }

    const messages = await getMessagesService(id as string);

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Błąd",
    });
  }
};

export const getMessagesService = async (id: string) => {
  const [rows] = await connection.query(
    `
SELECT

m.*,

u.email

FROM messages m

JOIN users u
ON u.id=m.sender_id


WHERE conversation_id=?

ORDER BY created_at ASC

`,
    [id],
  );

  return rows;
};

export const createMessage = async (data: any) => {
  const [result]: any = await connection.query(
    `
INSERT INTO messages
(
conversation_id,
sender_id,
message
)

VALUES(?,?,?)

`,
    [data.conversationId, data.senderId, data.message],
  );

  const [rows]: any = await connection.query(
    `
SELECT *
FROM messages
WHERE id=?
`,
    [result.insertId],
  );

  return rows[0];
};
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

    const message = await createMessage(data);

    io.to(`conversation_${data.conversationId}`).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
  });
});
