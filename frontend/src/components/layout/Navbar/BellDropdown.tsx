import { Link } from "react-router-dom";
import { useFavorite } from "../../../context/FavoritesContext";
import { useEffect, useRef } from "react";
type Props = {
  onClose: () => void;
};

const BellDropdown = ({ onClose }: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className=" top-10 w-125 absolute right-0 z-50 p-4 bg-white border border-gray-300 shadow-xl"
      ref={dropdownRef}
    >
      <h3 className="mb-3 text-lg font-bold">Powiadomienia </h3>
    </div>
  );
};
export default BellDropdown;
