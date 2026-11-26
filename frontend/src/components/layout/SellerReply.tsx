import { api } from "../../axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SellerReply = ({ reviewId }: { reviewId: string }) => {
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await api.put(`/api/reviews/${reviewId}/reply`, {
        reply,
      }),
    onSuccess: () => {
      setMessage("Dodano odpowiedź");
      setReply("");
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });

  const sendReply = async () => {
    if (!reply.trim()) {
      setMessage("Wpisz odpowiedź");
      return;
    }
    mutate();
  };

  return (
    <div className="mt-4 border border-(--border) bg-(--surface-secondary) p-4 text-(--foreground)">
      <h4 className="mb-2 font-semibold">Odpowiedz klientowi</h4>

      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Napisz odpowiedź..."
        className="min-h-24 w-full resize-none border border-(--border) bg-(--surface) p-3 text-(--foreground) outline-none placeholder:text-(--foreground-secondary) focus:border-orange-500"
      />

      {message && <p className="mt-2 text-sm text-(--foreground-secondary)">{message}</p>}

      <button
        disabled={isPending}
        onClick={sendReply}
        className="mt-3 cursor-pointer bg-orange-500 px-5 py-2 text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {isPending ? "Wysyłanie..." : "Odpowiedz"}
      </button>
    </div>
  );
};
export default SellerReply;
