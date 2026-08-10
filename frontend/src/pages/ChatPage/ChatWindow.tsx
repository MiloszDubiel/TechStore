import { useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "../../axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { socket } from "../../socket";
import LoadingScreen from "../../components/LoadingScreen";

const ChatWindow = ({ conversation }: any) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const markAsRead = async () => {
    await api.patch(`/api/socket/messages/read/${conversation.id}`, {});

    queryClient.invalidateQueries({
      queryKey: ["unreadMessages"],
    });
  };

  const {
    data: messages = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["messages", conversation?.id],

    enabled: !!conversation?.id,

    queryFn: async () => {
      const { data } = await api.get(`/api/socket/conversations/${conversation.id}/messages`);

      return data;
    },
  });

  useEffect(() => {
    if (!conversation) return;

    markAsRead();
  }, [conversation?.id]);

  const send = () => {
    if (!message) {
      return toast.error("Nie można wysłać pustej wiadomości.");
    }

    socket.emit("sendMessage", {
      conversationId: conversation.id,
      senderId: user?.id,
      message,
    });

    setMessage("");
  };

  useEffect(() => {
    if (!conversation?.id) return;

    socket.emit("joinConversation", conversation.id);

    const handleMessage = () => {
      refetch();
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [conversation?.id]);

  if (!conversation) {
    return <div className="flex flex-1 items-center justify-center text-(--foreground-secondary)">Wybierz rozmowę</div>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        {isLoading ? (
          <LoadingScreen />
        ) : messages?.length ? (
          messages.map((msg: any) => {
            const mine = msg.sender_id === user?.id;

            return (
              <div
                key={msg.id}
                className={`max-w-[70%] p-3 wrap-break-word ${
                  mine ? "ml-auto bg-(--primary) text-white" : "bg-(--surface-secondary) text-(--foreground)"
                }`}
              >
                <p>{msg.message}</p>

                <span className={`mt-1 block text-xs ${mine ? "text-orange-100" : "text-(--foreground-secondary)"}`}>
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center text-(--foreground-secondary)">Brak wiadomości</div>
        )}
      </div>

      <div className="flex shrink-0 gap-3 border-t border-(--border) bg-(--surface) p-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="min-w-0 flex-1 border border-(--border) bg-(--surface) px-4 py-3 text-(--foreground) outline-none focus:border-(--primary)"
        />

        <button className="shrink-0 cursor-pointer bg-(--primary) px-5 text-white transition hover:bg-(--primary-hover)" onClick={send}>
          Wyślij
        </button>
      </div>
    </div>
  );
};
export default ChatWindow;
