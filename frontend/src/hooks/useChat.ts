import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";

export const useChat = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const conversations = (user: any, token: string) =>
    useQuery({
      queryKey: ["get-conversations", user?.id],
      queryFn: async () => {
        const { data } = await axios.get(`/api/socket/get-conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return data;
      },
      enabled: !!user,
    });

  const unreadMessages = (user: any, token: string) =>
    useQuery({
      queryKey: ["unread-messages", user?.id],
      queryFn: async () => {
        const { data } = await axios.get(`/api/socket/get-notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return data;
      },
    });

  useEffect(() => {
    if (!user) return;

    socket.on("newNotification", () => {
      queryClient.invalidateQueries({
        queryKey: ["unread-messages"],
      });
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  return { conversations, unreadMessages };
};
