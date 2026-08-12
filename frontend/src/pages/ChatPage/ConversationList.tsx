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
    mutationFn: (data: any) => api.post("/api/socket/create-conversations", data),
  });

  useEffect(() => {
    if (!isSuccess || !seller_id) return;
    const conversation = conversationsData?.find((c: any) => c.seller_id === Number(seller_id));

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
      },
    );
  }, [seller_id, conversationsData?.id]);

  return (
    <div className="landscape:h- flex overflow-auto border-r border-(--border) md:block md:w-80">
      <h2 className="hidden p-5 text-xl font-bold text-(--foreground)">Wiadomości</h2>

      {conversationsData?.length > 0 ? (
        conversationsData.map((c: any) => {
          const isSeller = user?.id === c.seller_id;

          const name = isSeller ? `${c.buyer_first_name} ${c.buyer_last_name || "Klient"}` : c.shop_name;

          const avatar = isSeller ? null : c.logo;

          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`flex w-full cursor-pointer items-center gap-4 border-t border-(--border) p-4 text-left transition ${
                selected?.id === c.id ? "bg-orange-100 dark:bg-orange-950/30" : "hover:bg-(--surface-secondary)"
              } `}
            >
              {avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}uploads/sellers/${c.seller_id}/${avatar}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
                  {name?.charAt(0)}
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="truncate font-semibold text-(--foreground)">{name}</p>

                  {Number(c.unread_count) > 0 && selected?.id !== c.id && <span className="h-3 w-3 rounded-full bg-orange-500" />}
                </div>

                <p className="truncate text-sm text-(--foreground-secondary)">{c.last_message || "Brak wiadomości"}</p>
              </div>
            </button>
          );
        })
      ) : (
        <h2 className="p-5 text-xl font-bold text-(--foreground)">Brak konwersacji</h2>
      )}
    </div>
  );
};
export default ConversationList;
