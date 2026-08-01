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
    <form
      className="flex items-center w-1/3 overflow-hidden border border-gray-300"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative flex-1">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj produktów..."
          className=" w-full py-2 pl-10 pr-4 outline-none"
        />

        <Search
          className=" left-3 top-1/2 absolute text-gray-400 -translate-y-1/2"
          size={18}
        />
      </div>

      <button
        onClick={searchProduct}
        className=" px-5 py-2 text-white bg-orange-500 cursor-pointer hover:bg-orange-600"
      >
        Szukaj
      </button>
    </form>
  );
};
export default SearchBar;
