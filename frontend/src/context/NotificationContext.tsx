import { createContext, useEffect, useContext, useState } from "react";
import { socket } from "../socket";
import { useAuth } from "./AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../axios";
import { toast } from "react-toastify";

interface NotificationContextType {
  notifications: any[] | null;
  setAsDeleted: (id: number) => void;
  setAsRead: (id: number) => void;
  notificationData: [boolean, number];
  setAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: any) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [notificationData, setNotificationData] = useState<any>();

  const { data, refetch } = useQuery({
    queryKey: ["notifications", user?.id],

    queryFn: async () => {
      const { data = [] } = await axios.get("/api/notification/");

      return data;
    },

    enabled: !!user?.id,
  });

  const { mutate: setAsRead } = useMutation({
    mutationFn: (id: number) => axios.patch(`/api/notification/${id}/read`, {}),
    onSuccess: () => {
      toast.success("Zmieniono status powiadomienia");
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const { mutate: setAsDeleted } = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/notification/${id}/delete`),
    onSuccess: () => {
      toast.success("Usunięto powidomienia ");
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const { mutate: setAllAsRead } = useMutation({
    mutationFn: () => axios.patch(`/api/notification/read-all`, {}),
    onSuccess: () => {
      toast.success("Zmieniono status powiadomień");
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  useEffect(() => {
    const check = data?.some((el: any) => el.is_read === 0);

    const count = data?.reduce((acc: number, cur: any) => {
      return cur.is_read === 0 ? acc + 1 : acc;
    }, 0);

    setNotificationData([check, count]);
  }, [data]);

  useEffect(() => {
    socket.on("newNotification", () => {
      refetch();
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: data,
        setAsRead,
        setAsDeleted,
        notificationData,
        setAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification musi być użyty wewnątrz NotificationProvider"
    );
  }

  return context;
};
