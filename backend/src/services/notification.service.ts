import { prisma } from "../lib/prisma";
import { getIO } from "../socket/indext";

export const createNotificationService = async (data: any) => {
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      title: true,
      message: true,
    },
  });

  const result = {
    id: notification.id,
    userId: notification.userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
  };

  getIO().to(`user_${data.userId}`).emit("newNotification", result);

  return result;
};

export const getUserNotificationsService = async (userId: number) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    is_read: notification.isRead,
    created_at: notification.createdAt,
  }));
};

export const markNotificationAsReadService = async (
  notificationId: number,
  userId: number,
) => {
  const result = await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });

  return result.count > 0;
};

export const markAllNotificationsAsReadService = async (userId: number) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return result.count;
};

export const deleteNotificationFromDb = async (id: number, userId: number) => {
  const result = await prisma.notification.deleteMany({
    where: {
      id,
      userId,
    },
  });

  return result.count;
};
