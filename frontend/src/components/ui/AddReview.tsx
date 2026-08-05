import { api } from "../../axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AddReview = ({
  productId,
  seller_id,
}: {
  productId: string;
  seller_id: string;
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    if (!rating) {
      setMessage("Wybierz ocenę produktu");
      return;
    }

    if (!comment.trim()) {
      setMessage("Dodaj treść opinii");
      return;
    }

    try {
      await api.post("/api/reviews", {
        product_id: productId,
        rating,
        comment,
      });

      setComment("");
      setRating(0);
      setMessage("Opinia została dodana");
    } catch (error) {
      setMessage("Nie udało się dodać opinii");
    }
  };

  if (user && Number(seller_id) === Number(user.id)) {
    return null;
  }
  if (!user?.id) {
    return (
      <div className="p-6 text-center bg-white border border-gray-200">
        <h3 className="mb-2 text-lg font-semibold">Chcesz dodać opinię?</h3>

        <p className="mb-4 text-gray-500">
          Zaloguj się, aby móc ocenić ten produkt.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="hover:bg-orange-600 px-6 py-3 text-white bg-orange-500"
        >
          Zaloguj się
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200">
      <h3 className="mb-4 text-xl font-semibold">Dodaj opinię</h3>

      <p className="mb-2 text-sm text-gray-500">Twoja ocena</p>

      <div className="flex gap-1 mb-5" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hoverRating || rating);

          return (
            <Star
              key={star}
              size={34}
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
              className={`cursor-pointer transition ${
                active ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          );
        })}
      </div>

      <textarea
        className=" min-h-32 focus:border-orange-500 w-full p-3 border border-gray-300 outline-none resize-none"
        placeholder="Napisz swoją opinię..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}

      <button
        onClick={submit}
        className=" hover:bg-orange-600 px-6 py-3 mt-4 text-white bg-orange-500"
      >
        Dodaj opinię
      </button>
    </div>
  );
};
export default AddReview;
