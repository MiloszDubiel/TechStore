import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../axios";
import { useEffect } from "react";
import { useChat } from "../../hooks/useChat";

type Props = {
  selected: any;
  onSelect: (data: any) => void;
  seller_id: string;
};

const ConversationList = ({ selected, onSelect, seller_id }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { conversations } = useChat();

  const { data: conversationsData, isSuccess } = conversations(user);

  const { mutate } = useMutation({
    mutationFn: (data: any) =>
      api.post("/api/socket/create-conversations", data),
  });

  useEffect(() => {
    if (!isSuccess || !seller_id) return;
    const conversation = conversationsData?.find(
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
            queryKey: ["conversations", user?.id, "unreadMessages"],
          });
        },
      }
    );
  }, [seller_id, conversationsData?.id]);

  return (
    <div className="w-80 border-r border-(--border)">
      <h2 className="p-5 text-xl font-bold text-(--foreground)">Wiadomości</h2>

      {conversationsData?.length > 0 ? (
        conversationsData.map((c: any) => {
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
            border-(--border)
            cursor-pointer
            transition

            ${
              selected?.id === c.id
                ? "bg-orange-100 dark:bg-orange-950/30"
                : "hover:bg-(--surface-secondary)"
            }
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
                <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-orange-500 rounded-full">
                  {name?.charAt(0)}
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-(--foreground) truncate">
                    {name}
                  </p>

                  {Number(c.unread_count) > 0 && selected?.id !== c.id && (
                    <span className="w-3 h-3 bg-orange-500 rounded-full" />
                  )}
                </div>

                <p className="text-sm text-(--foreground-secondary) truncate">
                  {c.last_message || "Brak wiadomości"}
                </p>
              </div>
            </button>
          );
        })
      ) : (
        <h2 className="p-5 text-xl font-bold text-(--foreground)">
          Brak konwersacji
        </h2>
      )}
    </div>
  );
};
export default ConversationList;
