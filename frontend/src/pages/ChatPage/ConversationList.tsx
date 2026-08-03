import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useEffect } from "react";
import { useChat } from "../../hooks/useChat";

type Props = {
  selected: any;
  onSelect: (data: any) => void;
  seller_id: string;
};

const ConversationList = ({ selected, onSelect, seller_id }: Props) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const {
    conversations: { data: conversations, isSuccess },
  } = useChat(token!, user);

  const { mutate } = useMutation({
    mutationFn: (data: any) =>
      axios.post("/api/socket/create-conversations", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  useEffect(() => {
    if (!isSuccess || !seller_id) return;
    const conversation = conversations?.find(
      (c: any) => c.seller_id === Number(seller_id)
    );

    if (conversation) {
      onSelect(conversation);
      return;
    }

    mutate(
      { seller_id },
      {
        onSuccess: ({ data }) => {
          onSelect(data);

          queryClient.invalidateQueries({
            queryKey: ["conversations", user?.id],
          });
        },
      }
    );
  }, [seller_id, conversations]);

  return (
    <div className="w-80 border-r border-gray-300">
      <h2 className="p-5 text-xl font-bold">Wiadomości</h2>

      {conversations?.length > 0 ? (
        conversations.map((c: any) => {
          const isSeller = user?.id === c.seller_id;

          const name = isSeller
            ? `${c.buyer_first_name} ${c.buyer_last_name || "Klient"}`
            : c.shop_name;

          const avatar = isSeller ? null : c.logo;

          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`
          flex
          items-center
          gap-4
          w-full
          p-4
          text-left
          border-t
          border-gray-300
          cursor-pointer
          transition

          ${selected?.id === c.id ? "bg-orange-100" : "hover:bg-gray-50"}
        `}
            >
              {avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}uploads/sellers/${
                    c.seller_id
                  }/${avatar}`}
                  className="object-cover w-12 h-12 rounded-full"
                />
              ) : (
                <div className=" flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-orange-500 rounded-full">
                  {name?.charAt(0)}
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="font-semibold truncate">{name}</p>

                  {Number(c.unread_count) > 0 && (
                    <span className="w-3 h-3 bg-orange-500 rounded-full" />
                  )}
                </div>

                <p className="text-sm text-gray-500 truncate">
                  {c.last_message || "Brak wiadomości"}
                </p>
              </div>
            </button>
          );
        })
      ) : (
        <h2 className="p-5 text-xl font-bold">Brak konwersacji</h2>
      )}
    </div>
  );
};
export default ConversationList;
