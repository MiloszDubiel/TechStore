import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorite } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from "../../zustand/states/cartState";
import { Edit } from "lucide-react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
type OfferCardProps = {
  id: string;
  product: any;
};

const OfferCard: React.FC<OfferCardProps> = ({ product }) => {
  const { toggleFavorite, isFavorite } = useFavorite();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);
  const favorite = isFavorite(product.id);
  const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null);
  const importantParams = ["RAM", "Procesor", "Dysk", "Karta graficzna"];

  const displayedParams: string[] = [];

  const attributes =
    typeof product.attributes === "string"
      ? JSON.parse(product.attributes)
      : product.attributes ?? [];

  importantParams.forEach((name) => {
    const param = attributes.find((item: any) => item.name === name);

    if (param && displayedParams.length < 3) {
      displayedParams.push(`${param.name}: ${param.value}`);
    }
  });

  const getImage = (images: any[]) => {
    if (!images[0].url) return [];

    return product.images.map((img: any) => {
      if (img?.url?.includes("http")) return img.url;

      return `${import.meta.env.VITE_API_URL}${img.url}`;
    });
  };
  return (
    <div
      className="
    block
    border border-(--border)
    bg-(--surface)
    p-4
    text-(--foreground)
    transition
    hover:shadow-lg
  "
    >
      <div className="flex items-start gap-6">
        <img
          src={getImage(product.images)}
          alt={product.name}
          className="
        h-48
        w-48
        bg-(--surface-secondary)
        object-contain
      "
        />

        <div className="flex-1">
          <Link to={`/offers/${product.slug}/${product.id}`}>
            <h3 className=" line-clamp-2 hover:text-orange-600 hover:underline text-lg font-semibold transition">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-sm text-(--foreground-secondary)">
            Kategoria: {product.category_name ?? "Brak"}
          </p>

          <ul
            className="
          mt-2
          space-y-1
          text-sm
          text-(--foreground-secondary)
        "
          >
            {displayedParams.map((param) => (
              <li key={param}>{param}</li>
            ))}
          </ul>

          <p className="mt-2 text-sm text-(--foreground-secondary)">
            Dostępna szybka wysyłka • Gwarancja 24 miesiące
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <p className="text-2xl font-bold">{product.price} zł</p>

          <p
            className={
              product.stock > 0
                ? "text-sm text-green-500"
                : "text-sm text-red-500"
            }
          >
            {product.stock > 0
              ? `Dostępne: ${product.stock} szt.`
              : "Brak w magazynie"}
          </p>

          {product?.seller_id != user?.id && product.stock > 0 && (
            <button
              className=" hover:bg-orange-600 px-6 py-2 font-semibold text-white transition bg-orange-500 cursor-pointer"
              onClick={() => addToCart(product)}
            >
              Dodaj do koszyka
            </button>
          )}

          {product?.seller_id == user?.id && (
            <button
              className=" hover:bg-orange-600 flex items-center gap-2 px-6 py-2 font-semibold text-white transition bg-orange-500 cursor-pointer"
              onClick={() => {
                navigate(`/seller/dashboard?tab=products&edit=${product.id}`);
              }}
            >
              <Edit size={13} />
              Edytuj
            </button>
          )}

          {isAuthenticated && product?.seller_id !== user?.id && (
            <button
              onClick={() => {
                toggleFavorite(product.id);
                const message = favorite
                  ? "Usunięto z ulubionych"
                  : "Dodano do ulubionych";

                toast.success(message);
              }}
            >
              <Heart
                fill={favorite ? "#f97316" : "none"}
                color="#f97316"
                className="cursor-pointer"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OfferCard;
