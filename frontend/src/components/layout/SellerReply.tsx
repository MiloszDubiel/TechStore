import { api } from "../../axios";
import { useState } from "react";

const SellerReply = ({ reviewId }: { reviewId: string }) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendReply = async () => {
    if (!reply.trim()) {
      setMessage("Wpisz odpowiedź");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/api/reviews/${reviewId}/reply`, {
        reply,
      });

      setReply("");
      setMessage("Odpowiedź dodana");
    } catch (error) {
      setMessage("Nie udało się dodać odpowiedzi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      mt-4
      border border-(--border)
      bg-(--surface-secondary)
      p-4
      text-(--foreground)
    "
    >
      <h4 className="mb-2 font-semibold">Odpowiedz klientowi</h4>

      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Napisz odpowiedź..."
        className="
        min-h-24
        w-full
        resize-none
        border border-(--border)
        bg-(--surface)
        p-3
        text-(--foreground)
        outline-none
        placeholder:text-(--foreground-secondary)
        focus:border-orange-500
      "
      />

      {message && (
        <p className="mt-2 text-sm text-(--foreground-secondary)">{message}</p>
      )}

      <button
        disabled={loading}
        onClick={sendReply}
        className=" hover:bg-orange-600 disabled:opacity-50 px-5 py-2 mt-3 text-white transition bg-orange-500 cursor-pointer"
      >
        {loading ? "Wysyłanie..." : "Odpowiedz"}
      </button>
    </div>
  );
};
export default SellerReply;
