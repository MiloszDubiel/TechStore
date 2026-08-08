import { connection } from "../config/db.config";
import { getIO } from "../socket/indext";
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

  const notification = {
    id: result.insertId,
    ...data,
  };

  getIO().to(`user_${data.userId}`).emit("newNotification", notification);

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

export const markNotificationAsReadService = async (
  notificationId: number,
  userId: number,
) => {
  const [result]: any = await connection.query(
    `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
    AND user_id = ?
    `,
    [notificationId, userId],
  );

  return result.affectedRows > 0;
};

export const markAllNotificationsAsReadService = async (userId: number) => {
  const [result]: any = await connection.query(
    `
    UPDATE notifications
    SET is_read = 1
    WHERE user_id = ?
    AND is_read = 0
    `,
    [userId],
  );

  return result.affectedRows;
};

export const deleteNotificationFromDb = async (id: number, userId: number) => {
  const [result]: any = await connection.query(
    `
    DELETE FROM notifications
    WHERE user_id = ?
    AND id = ?
    `,
    [userId, id],
  );

  return result.affectedRows;
};
