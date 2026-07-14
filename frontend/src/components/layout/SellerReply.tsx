import axios from "axios";
import { useState } from "react";
const SellerReply = ({ reviewId }: { reviewId: string }) => {
  const [reply, setReply] = useState<string>("");

  const sendReply = async () => {
    await axios.put(`/api/reviews/${reviewId}/reply`, {
      reply,
    });
  };

  return (
    <div className="mt-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="w-full border"
      />

      <button onClick={sendReply} className="p-2 mt-1 text-white bg-green-600">
        Odpowiedz
      </button>
    </div>
  );
};

export default SellerReply;
