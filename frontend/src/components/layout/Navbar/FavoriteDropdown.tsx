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

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className=" top-10 w-125 absolute right-0 z-50 p-4 bg-white border border-gray-300 shadow-xl"
      ref={dropdownRef}
    >
      <h3 className="mb-3 text-lg font-bold">Ulubione produkty</h3>

      {favorites.length === 0 ? (
        <p>Brak ulubionych produktów</p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((product: any) => (
            <li
              key={product.id}
              className=" flex items-center gap-3 pb-2 border-b border-gray-300"
            >
              <img
                src={
                  product.images?.[0]
                    ? `${import.meta.env.VITE_API_URL}${
                        product.images.at(-1).url
                      }`
                    : "/no-image.png"
                }
                className=" object-cover w-12 h-12"
              />

              <div className="flex-1">
                <p className="line-clamp-2 font-medium">{product.name}</p>

                <p className="text-sm text-gray-500">{product.price} zł</p>
              </div>

              <Link
                onClick={onClose}
                to={`/offers/${product.slug}/${product.id}`}
                className="text-sm text-orange-500"
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
