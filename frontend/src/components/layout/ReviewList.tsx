import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SellerReply from "./../layout/SellerReply";

const ReviewsList = ({ productId }: { productId: string }) => {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await axios.get(`/api/reviews/product/${productId}`);

      return Array.isArray(res.data) ? res.data : [];
    },
  });

 

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Ładowanie opinii...</div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="p-6 text-center border border-gray-200">
        <p className="text-gray-500">Ten produkt nie posiada jeszcze opinii.</p>
      </div>
    );
  }

  return (
    <div className="mb-5 space-y-5">
      {reviews.map((review: any) => (
        <div key={review.id} className="p-5 bg-white border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className=" flex items-center justify-center w-10 h-10 font-bold text-white bg-orange-500 rounded-full">
                {review.email?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-semibold">{review.email}</p>

                <p className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-gray-700">{review.comment}</p>

          {review.seller_reply && (
            <div className=" bg-gray-50 p-4 mt-4 border-l-4 border-orange-500">
              <p className="font-semibold">Odpowiedź sprzedawcy</p>

              <p className="mt-1 text-gray-700">{review.seller_reply}</p>
            </div>
          )}

          {user?.role === "SELLER" && !review.seller_reply && (
            <SellerReply reviewId={review.id}  />
          )}
        </div>
      ))}
    </div>
  );
};
export default ReviewsList;
