import { Request, Response } from "express";
import {
  getUserNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationFromDb,
} from "../services/notification.service";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const notifications = await getUserNotificationsService(userId);

    res.json(notifications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania powiadomień",
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { id } = req.params;

    await markNotificationAsReadService(Number(id), userId);

    res.json({
      message: "Powiadomienie oznaczone jako przeczytane",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd aktualizacji",
    });
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any).user.id;

    await markAllNotificationsAsReadService(userId);

    res.json({
      message: "Wszystkie powiadomienia przeczytane",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd aktualizacji",
    });
  }
};
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Brak id",
      });
    }

    await deleteNotificationFromDb(Number(id), userId);

    res.json({
      message: "Wszystkie powiadomienia przeczytane",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd aktualizacji",
    });
  }
};
