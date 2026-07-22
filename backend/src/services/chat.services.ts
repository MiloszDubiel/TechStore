import { connection } from "../config/db.config";

export const getMessagesService = async (
  conversationId: string,
  userId: number,
) => {
  const [conversation]: any = await connection.query(
    `
SELECT id
FROM conversations
WHERE id=?
AND (
    user_id=?
    OR
    seller_id=?
)
`,
    [conversationId, userId, userId],
  );

  if (!conversation.length) {
    return null;
  }

  const [messages]: any = await connection.query(
    `
SELECT

m.id,
m.message,
m.created_at,

u.id AS sender_id,
u.email AS sender_email


FROM messages m


JOIN users u
ON u.id=m.sender_id


WHERE m.conversation_id=?


ORDER BY m.created_at ASC

`,
    [conversationId],
  );

  return messages;
};

export const createMessageService = async (data: any) => {
  const [result]: any = await connection.query(
    `
    INSERT INTO messages
    (
      conversation_id,
      sender_id,
      message
    )
    VALUES (?, ?, ?)
    `,
    [data.conversationId, data.senderId, data.message],
  );

  const [rows]: any = await connection.query(
    `
    SELECT
      m.id,
      m.conversation_id,
      m.sender_id,
      m.message,
      m.created_at,

      u.email

    FROM messages m

    JOIN users u
      ON u.id = m.sender_id

    WHERE m.id = ?
    `,
    [result.insertId],
  );

  return rows;
};

export const createConversationService = async (data: any) => {
  const [existing]: any = await connection.query(
    `
SELECT *
FROM conversations
WHERE user_id=?
AND seller_id=?
`,
    [data.user_id, data.seller_id],
  );

  if (existing.length) {
    return existing[0];
  }

  const [result]: any = await connection.query(
    `
INSERT INTO conversations
(
user_id,
seller_id
)
VALUES(?,?)
`,
    [data.user_id, data.seller_id],
  );

  const [rows]: any = await connection.query(
    `
SELECT *
FROM conversations
WHERE id=?
`,
    [result.insertId],
  );

  return rows[0];
};

export const getConversationsService = async (userId: number) => {
  const [rows]: any = await connection.query(
    `
 SELECT

    c.id,
    c.created_at,

    -- kupujący
    buyer.id AS buyer_id,
    buyer.email AS buyer_email,
    buyer.name AS buyer_first_name,
    buyer.last_name AS buyer_last_name,


    -- sprzedawca
    seller.id AS seller_id,
    seller.email AS seller_email,
    seller.name AS seller_first_name,
    seller.last_name AS seller_last_name,


    -- sklep
    sp.shop_name,
    sp.logo,


    (
        SELECT m.message
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
    ) AS last_message,


    (
        SELECT m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
    ) AS last_message_date


FROM conversations c


JOIN users buyer
ON buyer.id = c.user_id


JOIN users seller
ON seller.id = c.seller_id


LEFT JOIN seller_profiles sp
ON sp.user_id = seller.id


WHERE 
c.user_id = ?
OR 
c.seller_id = ?


ORDER BY last_message_date DESC;`,
    [userId, userId],
  );

  return rows;
};
