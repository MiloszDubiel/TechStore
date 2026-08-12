import React from "react";
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
  const importantParams = ["RAM", "Procesor", "Dysk", "Karta graficzna"];

  const displayedParams: string[] = [];

  const attributes = typeof product.attributes === "string" ? JSON.parse(product.attributes) : (product.attributes ?? []);

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
    <div className="flex min-w-0 flex-col gap-4 bg-(--surface) p-4 text-(--foreground) sm:flex-row sm:items-start sm:justify-between">
      <Link
        to={`/offers/${product.slug}/${product.id}`}
        className="flex h-48 w-full shrink-0 items-center justify-center overflow-hidden bg-(--surface-secondary) sm:h-32 sm:w-32"
      >
        <img src={getImage(product.images)} alt={product.name} className="h-full w-full object-contain" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/offers/${product.slug}/${product.id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold text-(--foreground) transition hover:text-(--primary) hover:underline">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 text-sm text-(--foreground-secondary)">Kategoria: {product.category_name ?? "Brak"}</p>

        <ul className="mt-2 space-y-1 text-sm text-(--foreground-secondary)">
          {displayedParams.map((param) => (
            <li key={param}>{param}</li>
          ))}
        </ul>

        <p className="mt-2 text-sm text-(--foreground-secondary)">Dostępna szybka wysyłka • Gwarancja 24 miesiące</p>
      </div>

      <div className="flex min-w-0 flex-col items-stretch gap-3 sm:w-40 sm:shrink-0 sm:items-end">
        <p className="text-2xl font-bold text-(--foreground)">{product.price} zł</p>

        <p className={product.stock > 0 ? "text-sm text-(--success)" : "text-sm text-(--danger)"}>
          {product.stock > 0 ? `Dostępne: ${product.stock} szt.` : "Brak w magazynie"}
        </p>

        {product?.seller_id != user?.id && product.stock > 0 && (
          <button
            className="w-full cursor-pointer bg-(--primary) px-4 py-2 font-semibold text-white transition hover:bg-(--primary-hover) sm:w-auto sm:whitespace-nowrap"
            onClick={() => {
              addToCart(product);
              toast.success("Dodano do koszuka");
              document.getElementById("navbar")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Dodaj do koszyka
          </button>
        )}

        {product?.seller_id == user?.id && (
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) px-4 py-2 font-semibold text-white transition hover:bg-(--primary-hover) sm:w-auto sm:whitespace-nowrap"
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
            className="flex cursor-pointer justify-center"
            onClick={() => {
              toggleFavorite(product.id);

              const message = favorite ? "Usunięto z ulubionych" : "Dodano do ulubionych";

              toast.success(message);
            }}
          >
            <Heart fill={favorite ? "var(--primary)" : "none"} color="var(--primary)" className="transition" />
          </button>
        )}
      </div>
    </div>
  );
};
export default OfferCard;
