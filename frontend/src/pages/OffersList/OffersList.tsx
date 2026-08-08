import Navbar from "../../components/layout/Navbar/Navbar";
import { useMemo, useState } from "react";
import { api } from "../../axios";
import OfferCard from "../../components/ui/OffersCard";
import Pagination from "../../components/ui/Pagination";
import { useSearchParams } from "react-router-dom";
import FiltersSidebar from "../../components/layout/FiltersSidebar";
import { useQuery } from "@tanstack/react-query";
import MobileFiltersSidebar from "../../components/layout/MobileFiltersSidebar";

const OffersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const allParams = Object.fromEntries(searchParams.entries());
  const { search, ...filters } = allParams;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const fetchProducts = async () => {
    const params = Object.fromEntries(searchParams.entries());

    const res = await api.get("/api/products/products", {
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
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <FiltersSidebar searchParams={searchParams} setSearchParams={setSearchParams} />

        <MobileFiltersSidebar searchParams={searchParams} setSearchParams={setSearchParams} />

        <div className="flex w-full flex-col gap-6">
          {isLoading ? (
            <>
              <div className="mb-4 flex flex-col items-end">
                <div className="w-full">
                  {searchParams.get("search") && (
                    <h1 className="mb-2 text-(--foreground-secondary)">
                      Wyniki wyszukiwania dla frazy: <span className="font-semibold text-orange-500">{searchParams.get("search")}</span>
                    </h1>
                  )}
                </div>

                <h3 className="mb-2 font-semibold text-(--foreground)">Sortuj</h3>

                <select
                  disabled
                  className="w-52 border border-(--border) bg-(--surface) px-2 py-1 text-(--foreground) focus:border-orange-500 focus:ring focus:ring-orange-200"
                >
                  <option value="">Domyślnie</option>
                  <option value="price_asc">Cena rosnąco</option>
                  <option value="price_desc">Cena malejąco</option>
                  <option value="rating_desc">Najlepsze oceny</option>
                </select>
              </div>

              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-start gap-6 border border-(--border) bg-(--surface) p-4 transition hover:shadow-lg">
                  <div className="h-32 w-40 shrink-0 rounded-md bg-(--surface-secondary)" />

                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-(--surface-secondary)" />

                    <div className="h-4 w-1/2 rounded bg-(--surface-secondary)" />

                    <div className="mt-1 space-y-1">
                      <div className="h-3 w-full rounded bg-(--surface-secondary)" />
                      <div className="h-3 w-5/6 rounded bg-(--surface-secondary)" />
                      <div className="h-3 w-2/3 rounded bg-(--surface-secondary)" />
                    </div>

                    <div className="mt-2 h-4 w-2/3 rounded bg-(--surface-secondary)" />
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="h-6 w-16 rounded bg-(--surface-secondary)" />

                    <div className="h-10 w-32 rounded bg-(--surface-secondary)" />

                    <div className="h-6 w-6 rounded bg-(--surface-secondary)" />
                  </div>
                </div>
              ))}
            </>
          ) : sortedProducts.length > 0 ? (
            <>
              <div className="mb-4 flex flex-col items-end border-b border-(--border) pb-4">
                {search && (
                  <h1 className="mb-2 text-(--foreground-secondary)">
                    Wyniki dla: <span className="font-semibold text-orange-500">{search}</span>
                  </h1>
                )}

                <h3 className="mb-2 font-semibold text-(--foreground)">Sortuj</h3>

                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-52 border border-(--border) bg-(--surface) px-2 py-1 text-(--foreground)"
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
            <p className="text-(--foreground-secondary)">Brak produktów spełniających kryteria.</p>
          )}

          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default OffersList;
