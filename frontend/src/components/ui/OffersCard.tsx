import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorite } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from "../../zustand/states/cartState";
import { Edit } from "lucide-react";

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
    if (!Array.isArray(images)) {
      return "/no-image.png";
    }

    return images[0].url.includes("https")
      ? images[0].url
      : `${import.meta.env.VITE_API_URL}uploads/products/${product.seller_id}/${
          product.id
        }/${product.images[0].image}`;
  };

  return (
    <div className=" hover:shadow-lg block p-4 transition bg-white border border-gray-200">
      <div className="flex items-start gap-6">
        <img
          src={getImage(product.images)}
          alt={product.name}
          className=" object-contain w-48 h-48 bg-white"
        />

        <div className="flex-1">
          <Link to={`/offers/${product.slug}/${product.id}`}>
            <h3 className=" hover:underline line-clamp-2 hover:text-orange-600 text-lg font-semibold">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-sm text-gray-500">
            Kategoria: {product.category_name ?? "Brak"}
          </p>

          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {displayedParams.map((param) => (
              <li key={param}>{param}</li>
            ))}
          </ul>

          <p className="mt-2 text-sm text-gray-500">
            Dostępna szybka wysyłka • Gwarancja 24 miesiące
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <p className="text-2xl font-bold">{product.price} zł</p>

          <p
            className={
              product.stock > 0
                ? "text-green-600 text-sm"
                : "text-red-500 text-sm"
            }
          >
            {product.stock > 0
              ? `Dostępne: ${product.stock} szt.`
              : "Brak w magazynie"}
          </p>

          {product?.seller_id != user?.id && (
            <button
              className=" hover:bg-orange-600 px-6 py-2 font-semibold text-white bg-orange-500 cursor-pointer"
              onClick={() => addToCart(product)}
            >
              Dodaj do koszyka
            </button>
          )}

          {product?.seller_id == user?.id && (
            <button
              className=" hover:bg-orange-600 flex items-center gap-2 px-6 py-2 font-semibold text-white bg-orange-500 cursor-pointer"
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
                setFavoriteMessage(message);
                setTimeout(() => {
                  setFavoriteMessage(null);
                }, 2000);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={favorite ? "#f97316" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={favorite ? "#f97316" : "currentColor"}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {favoriteMessage && (
        <div className=" bottom-6 right-6 fixed z-50 px-4 py-2 bg-white border border-orange-400">
          {favoriteMessage}
        </div>
      )}
    </div>
  );
};
export default OfferCard;
