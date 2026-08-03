import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { socket } from "../socket"; // import Twojej instancji socket.io

export const useChat = (token: string, user: any) => {
  const queryClient = useQueryClient();

  const conversations = useQuery({
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

  useEffect(() => {
    if (!user) return;

    socket.on("newNotification", () => {
      queryClient.invalidateQueries({
        queryKey: ["get-conversations", user?.id],
      });
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  return { conversations };
};
