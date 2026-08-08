import { Request, Response } from "express";
import {
  getMessagesService,
  createMessageService,
  createConversationService,
  getConversationsService,
  getNotificationsService,
  markMessagesAsReadService,
} from "../services/chat.services";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userId = (req as any).user.id;

    if (!id) {
      return res.status(400).json({
        message: "Brak id konwersacji",
      });
    }

    const messages = await getMessagesService(id as string, userId);

    if (!messages) {
      return res.status(403).json({
        message: "Brak dostępu do tej rozmowy",
      });
    }

    return res.json(messages);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Błąd pobierania wiadomości",
    });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, message } = req.body;

    const senderId = (req as any).user.id;

    if (!conversationId || !message?.trim()) {
      return res.status(400).json({
        message: "Brak wymaganych danych.",
      });
    }

    const newMessage = await createMessageService({
      conversationId,
      senderId,
      message: message.trim(),
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Wystąpił błąd podczas wysyłania wiadomości.",
    });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { seller_id } = req.body;

    const user_id = (req as any).user.id;

    if (!seller_id) {
      return res.status(400).json({
        message: "Brak sprzedawcy",
      });
    }

    const conversation = await createConversationService({
      user_id,
      seller_id,
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd tworzenia rozmowy",
    });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const conversations = await getConversationsService(userId);

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania konwersacji",
    });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const notifications = await getNotificationsService(userId);

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania powiadomień",
    });
  }
};
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const conversationId = Number(req.params.conversationId);

    await markMessagesAsReadService(conversationId, userId);

    res.json({
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
