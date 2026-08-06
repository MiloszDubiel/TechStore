import { Link } from "react-router-dom";
import { useFavorite } from "../../../context/FavoritesContext";
import { useEffect, useRef } from "react";

type Props = {
  onClose: () => void;
};

const FavoritesDropdown = ({ onClose }: Props) => {
  const { favorites } = useFavorite();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="
        absolute right-0 top-10 z-50 w-125
        border border-(--border)
        bg-(--surface)
        p-4
        text-(--foreground)
        shadow-xl
      "
    >
      <h3 className="mb-3 text-lg font-bold">Ulubione produkty</h3>

      {favorites.length === 0 ? (
        <p className="text-sm text-(--foreground-secondary)">
          Brak ulubionych produktów
        </p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((product: any) => (
            <li
              key={product.id}
              className="
                flex items-center gap-3
                border-b border-(--border)
                pb-2
              "
            >
              <img
                src={
                  product.images?.[0]
                    ? `${import.meta.env.VITE_API_URL}${
                        product.images.at(-1).url
                      }`
                    : "/no-image.png"
                }
                alt={product.name}
                className="
                  h-12 w-12
                  object-cover
                  bg-(--surface-secondary)
                "
              />

              <div className="flex-1">
                <p className="line-clamp-2 font-medium">{product.name}</p>

                <p className="text-sm text-(--foreground-secondary)">
                  {product.price} zł
                </p>
              </div>

              <Link
                onClick={onClose}
                to={`/offers/${product.slug}/${product.id}`}
                className=" hover:text-orange-400 text-sm text-orange-500 transition"
              >
                Zobacz
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default FavoritesDropdown;
