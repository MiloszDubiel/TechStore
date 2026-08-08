import { Link } from "react-router-dom";
import { useFavorite } from "../../../context/FavoritesContext";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

const FavoritesDropdown = ({ onClose }: Props) => {
  const { favorites } = useFavorite();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      className="fixed top-0 right-0 left-0 z-50 h-full w-full border border-(--border) bg-(--surface) p-4 text-(--foreground) shadow-xl md:absolute md:inset-auto md:top-10 md:right-0 md:h-auto md:w-125"
    >
      <div className="flex w-full justify-end md:hidden">
        <X onClick={onClose} className="cursor-pointer" />
      </div>
      <h3 className="mb-3 text-lg font-bold">Ulubione produkty</h3>

      {favorites.length === 0 ? (
        <p className="text-sm text-(--foreground-secondary)">Brak ulubionych produktów</p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((product: any) => (
            <li key={product.id} className="flex items-center gap-3 border-b border-(--border) pb-2">
              <img
                src={product.images?.[0] ? `${import.meta.env.VITE_API_URL}${product.images.at(-1).url}` : "/no-image.png"}
                alt={product.name}
                className="h-12 w-12 bg-(--surface-secondary) object-cover"
              />

              <div className="flex-1">
                <p className="line-clamp-2 font-medium">{product.name}</p>

                <p className="text-sm text-(--foreground-secondary)">{product.price} zł</p>
              </div>

              <Link
                onClick={onClose}
                to={`/offers/${product.slug}/${product.id}`}
                className="text-sm text-orange-500 transition hover:text-orange-400"
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
