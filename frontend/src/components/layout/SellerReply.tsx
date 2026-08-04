import axios from "../../axios";
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

      await axios.put(`/api/reviews/${reviewId}/reply`, {
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
    <div className="bg-gray-50 p-4 mt-4 border border-gray-200">
      <h4 className="mb-2 font-semibold">Odpowiedz klientowi</h4>

      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Napisz odpowiedź..."
        className=" min-h-24 focus:border-orange-500 w-full p-3 border border-gray-300 outline-none resize-none"
      />

      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}

      <button
        disabled={loading}
        onClick={sendReply}
        className=" hover:bg-orange-600 disabled:opacity-50 px-5 py-2 mt-3 text-white bg-orange-500"
      >
        {loading ? "Wysyłanie..." : "Odpowiedz"}
      </button>
    </div>
  );
};
export default SellerReply;
