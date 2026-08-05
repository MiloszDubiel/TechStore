import { useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "../../axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { socket } from "../../socket";

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
      const { data } = await api.get(
        `/api/socket/conversations/${conversation.id}/messages`
      );

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
    return (
      <div className="flex items-center justify-center flex-1 text-gray-400">
        Wybierz rozmowę
      </div>
    );
  }
  const isSeller = user?.id === conversation.seller_id;
  const name = isSeller
    ? `${conversation.buyer_first_name} ${
        conversation.buyer_last_name || "Klient"
      }`
    : conversation.shop_name;
  return (
    <div className="flex flex-col flex-1">
      <div className="p-5 font-bold border-b border-gray-300">{name}</div>

      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-400">Ładowanie wiadomości...</p>
        ) : messages?.length ? (
          messages.map((msg: any) => {
            const mine = msg.sender_id === user?.id;

            return (
              <div
                key={msg.id}
                className={`
                max-w-[70%]
                p-3
                

                ${
                  mine
                    ? "ml-auto bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }
              `}
              >
                <p>{msg.message}</p>

                <span
                  className={`
                  block
                  mt-1
                  text-xs

                  ${mine ? "text-orange-100" : "text-gray-400"}
                `}
                >
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400">Brak wiadomości</div>
        )}
      </div>

      <div className="flex gap-3 p-4 border-t border-gray-300">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          className=" flex-1 px-4 py-3 border border-gray-300"
        />

        <button
          className=" hover:bg-orange-600 px-5 text-white bg-orange-500"
          onClick={send}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
};
export default ChatWindow;
