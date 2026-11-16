import { connection } from "../config/db.config";
import { prisma } from "../lib/prisma";

export const getMessagesService = async (
  conversationId: string,
  userId: number,
) => {
  const id = Number(conversationId);

  if (!Number.isInteger(id)) {
    return null;
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      OR: [{ userId }, { sellerId: userId }],
    },
    select: {
      id: true,
    },
  });

  if (!conversation) {
    return null;
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId: id,
    },
    select: {
      id: true,
      message: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages.map((message: any) => ({
    id: message.id,
    message: message.message,
    created_at: message.createdAt,
    sender_id: message.sender.id,
    sender_email: message.sender.email,
  }));
};
export const createMessageService = async (data: any) => {
  const message = await prisma.message.create({
    data: {
      conversationId: Number(data.conversationId),
      senderId: data.senderId,
      message: data.message,
    },
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      message: true,
      createdAt: true,
      sender: {
        select: {
          email: true,
        },
      },
    },
  });

  return [
    {
      id: message.id,
      conversation_id: message.conversationId,
      sender_id: message.senderId,
      message: message.message,
      created_at: message.createdAt,
      email: message.sender.email,
    },
  ];
};
export const createConversationService = async (data: any) => {
  const existing = await prisma.conversation.findFirst({
    where: {
      userId: data.user_id,
      sellerId: data.seller_id,
    },
  });

  if (existing) {
    return existing;
  }

  return await prisma.conversation.create({
    data: {
      userId: data.user_id,
      sellerId: data.seller_id,
    },
  });
};
export const getConversationsService = async (userId: number) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ userId }, { sellerId: userId }],
    },
    select: {
      id: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
        },
      },

      seller: {
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,

          sellerProfiles: {
            select: {
              shopName: true,
              logo: true,
            },
            take: 1,
          },
        },
      },

      messages: {
        select: {
          message: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },

      _count: {
        select: {
          messages: {
            where: {
              isRead: false,
              senderId: {
                not: userId,
              },
            },
          },
        },
      },
    },
  });

  const result = conversations.map((conversation) => {
    const lastMessage = conversation.messages[0];
    const sellerProfile = conversation.seller.sellerProfiles[0];

    return {
      id: conversation.id,
      created_at: conversation.createdAt,

      buyer_id: conversation.user.id,
      buyer_email: conversation.user.email,
      buyer_first_name: conversation.user.name,
      buyer_last_name: conversation.user.lastName,

      seller_id: conversation.seller.id,
      seller_email: conversation.seller.email,
      seller_first_name: conversation.seller.name,
      seller_last_name: conversation.seller.lastName,

      shop_name: sellerProfile?.shopName ?? null,
      logo: sellerProfile?.logo ?? null,

      last_message: lastMessage?.message ?? null,
      last_message_date: lastMessage?.createdAt ?? null,

      unread_count: conversation._count.messages,
    };
  });

  return result.sort((a, b) => {
    const dateA = a.last_message_date?.getTime() ?? 0;
    const dateB = b.last_message_date?.getTime() ?? 0;

    return dateB - dateA;
  });
};

export const getNotificationsService = async (userId: number) => {
  const unreadCount = await prisma.message.count({
    where: {
      isRead: false,
      senderId: {
        not: userId,
      },
      conversation: {
        OR: [{ userId }, { sellerId: userId }],
      },
    },
  });

  return unreadCount;
};

export const markMessagesAsReadService = async (
  conversationId: number,
  userId: number,
) => {
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: {
        not: userId,
      },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return true;
};
