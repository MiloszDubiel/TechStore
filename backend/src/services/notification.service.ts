import { connection } from "../config/db.config";


export const createNotificationService = async (data: any) => {
  const [result]: any = await connection.query(
    `
    INSERT INTO notifications
    (
      user_id,
      type,
      title,
      message
    )

    VALUES(?,?,?,?)
    `,
    [data.userId, data.type, data.title, data.message],
  );

  const [rows]: any = await connection.query(
    `
    SELECT *
    FROM notifications
    WHERE id=?
    `,
    [result.insertId],
  );

  const notification = rows[0];

  return notification;
};

export const getUserNotificationsService = async (userId: number) => {
  const [rows]: any = await connection.query(
    `
    SELECT
      id,
      type,
      title,
      message,
      is_read,
      created_at

    FROM notifications

    WHERE user_id=?

    ORDER BY created_at DESC

    LIMIT 50
    `,
    [userId],
  );

  return rows;
};
