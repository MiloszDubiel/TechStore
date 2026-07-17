import { create } from "zustand";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationState {
  message: string;
  type: NotificationType;
  isVisible: boolean;

  showNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;

  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: "",
  type: "info",
  isVisible: false,

  showNotification: (message, type = "info", duration = 3000) => {
    set({
      message,
      type,
      isVisible: true,
    });

    setTimeout(() => {
      set({
        isVisible: false,
      });
    }, duration);
  },

  hideNotification: () =>
    set({
      isVisible: false,
    }),
}));
