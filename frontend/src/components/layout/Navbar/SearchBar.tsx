import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const SearchBar = ({ search, setSearch }: Props) => {
  const navigate = useNavigate();

  const searchProduct = () => {
    const query = search.trim();

    if (query) {
      navigate(`/offers?search=${encodeURIComponent(query)}&page=1`);
    }
  };

  return (
    <form className="flex w-80 items-center overflow-hidden border border-gray-300" onSubmit={(e) => e.preventDefault()}>
      <div className="relative flex-1">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj produktów..."
          className="w-full py-2 pr-4 pl-10 outline-none"
        />

        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
      </div>

      <button onClick={searchProduct} className="cursor-pointer bg-orange-500 px-5 py-2 text-white hover:bg-orange-600">
        Szukaj
      </button>
    </form>
  );
};
export default SearchBar;
