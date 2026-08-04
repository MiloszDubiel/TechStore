import Navbar from "../../components/layout/Navbar/Navbar";
import { useMemo, useState } from "react";
import axios from "axios";
import OfferCard from "../../components/ui/OffersCard";
import Pagination from "../../components/ui/Pagination";
import { useSearchParams } from "react-router-dom";
import FiltersSidebar from "../../components/layout/FiltersSidebar";
import { useQuery } from "@tanstack/react-query";

const OffersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const allParams = Object.fromEntries(searchParams.entries());
  const { search, ...filters } = allParams;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const fetchProducts = async () => {
    const params = Object.fromEntries(searchParams.entries());

    const res = await axios.get("/api/products/products", {
      params: {
        ...params,
        limit: 10,
        page,
      },
    });

    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters, search, sort, page],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products ?? [];



  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;

        case "price_desc":
          return b.price - a.price;

        case "rating_desc":
          return b.rating - a.rating;

        default:
          return 0;
      }
    });
  }, [products, sort]);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    setSearchParams(params);
    setSort(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));

    setSearchParams(params);
  };
  return (
    <>
      <Navbar />

      <div className="max-w-7xl flex gap-6 p-6 mx-auto">
        <FiltersSidebar
          brands={[...new Set(products.map((el: any) => el.brand))] as string[]}
        />

        <div className="flex flex-col w-full gap-6">
          {isLoading ? (
            <>
              <div className="flex flex-col items-end mb-4">
                <div className="w-full">
                  {searchParams.get("search") && (
                    <h1 className="mb-2 text-gray-600">
                      Wyniki wyszukiwania dla frazy:{" "}
                      <span className="font-semibold text-orange-500">
                        {searchParams.get("search")}
                      </span>
                    </h1>
                  )}
                </div>

                <h3 className="mb-2 font-semibold">Sortuj</h3>
                <select
                  disabled
                  className="w-52 focus:border-orange-500 focus:ring focus:ring-orange-200 px-2 py-1 border border-gray-200"
                >
                  <option value="">Domyślnie</option>
                  <option value="price_asc">Cena rosnąco</option>
                  <option value="price_desc">Cena malejąco</option>
                  <option value="rating_desc">Najlepsze oceny</option>
                </select>
              </div>
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className=" hover:shadow-lg flex items-start gap-6 p-4 transition bg-white border border-gray-200"
                >
                  <div className="shrink-0 w-40 h-32 bg-gray-300 rounded-md" />

                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-5 bg-gray-300 rounded"></div>{" "}
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>{" "}
                    <div className="mt-1 space-y-1">
                      <div className="w-full h-3 bg-gray-300 rounded"></div>
                      <div className="w-5/6 h-3 bg-gray-300 rounded"></div>
                      <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="w-2/3 h-4 mt-2 bg-gray-300 rounded"></div>{" "}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="w-16 h-6 bg-gray-300 rounded"></div>{" "}
                    <div className="w-32 h-10 bg-gray-300 rounded"></div>{" "}
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>{" "}
                  </div>
                </div>
              ))}
            </>
          ) : sortedProducts.length > 0 ? (
            <>
              <div className="flex flex-col items-end mb-4 border-gray-200">
                {search && (
                  <h1 className="mb-2 text-gray-600">
                    Wyniki dla:{" "}
                    <span className="font-semibold text-orange-500">
                      {search}
                    </span>
                  </h1>
                )}

                <h3 className="mb-2 font-semibold">Sortuj</h3>

                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-52 px-2 py-1 border border-gray-200"
                >
                  <option value="">Domyślnie</option>
                  <option value="price_asc">Cena rosnąco</option>
                  <option value="price_desc">Cena malejąco</option>
                  <option value="rating_desc">Najlepsze oceny</option>
                </select>
              </div>

              {sortedProducts?.map((product: any) => (
                <OfferCard key={product.id} id={product.id} product={product} />
              ))}
            </>
          ) : (
            <p>Brak produktów spełniających kryteria.</p>
          )}{" "}
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default OffersList;
