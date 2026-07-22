import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ChatWindow = ({ conversation }: any) => {
  const [message, setMessage] = useState("");
  const { user, token } = useAuth();

  const { mutate: sendMessage } = useMutation({
    mutationFn: () =>
      axios.post(
        "/api/socket/messages",
        {
          sender_id: user?.id,
          message,
          conversationId: conversation.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", conversation?.id],

    queryFn: async () => {
      const { data } = await axios.get(
        `/api/socket/conversations/${conversation.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
  });

  console.log(messages);

  const send = () => {
    if (!message) {
      return toast.error("Nie można wysłać pustej wiadomości.");
    }
    sendMessage();
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-400">
        Wybierz rozmowę
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="p-5 font-bold border-b border-gray-300">
        {conversation.name}
      </div>

      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-400">Ładowanie wiadomości...</p>
        ) : messages.length ? (
          messages.map((msg: any) => {
            const mine = msg.sender_id === user?.id;

            return (
              <div
                key={msg.id}
                className={`
                max-w-[70%]
                p-3
                rounded-lg

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
