import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../axios";
import { CheckCircle, Store, Edit } from "lucide-react";
import { useImage } from "../../hooks/useImage";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import Pagination from "../../components/ui/Pagination";
import LoadingScreen from "../../components/LoadingScreen";

const SellerPage = () => {
  const { slug, id } = useParams();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 8;

  const fetchSeller = async () => {
    const { data } = await api.get(`/api/seller/${slug}/${id}`);

    return data;
  };

  const { data: seller, isLoading } = useQuery({
    queryKey: ["seller", slug],
    queryFn: fetchSeller,
    enabled: !!slug && !!id,
  });

  const filteredProducts = seller.products.filter((product: any) => product.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / limit);

  const products = filteredProducts.slice((page - 1) * limit, page * limit);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingScreen />
      </>
    );
  }

  if (!seller) {
    return (
      <>
        <Navbar />
        <p className="p-10 text-center">Nie znaleziono sklepu</p>
      </>
    );
  }
  useEffect(() => {
    setPage(1);
  }, [search]);
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-(--background) py-10">
        <div className="mx-auto max-w-7xl space-y-10 px-6">
          <section className="border border-(--border) bg-(--surface) p-8">
            <div className="flex items-center gap-6">
              <div className="flex h-32 w-32 items-center justify-center border border-(--border) bg-(--surface-secondary)">
                {seller.logo ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}uploads/sellers/${seller.seller_id}/${seller.logo}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store size={45} className="text-(--foreground-secondary)" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-(--foreground)">{seller.shop_name}</h1>

                  {seller.is_verified === 1 && <CheckCircle className="text-(--success)" />}
                </div>

                <p className="mt-2 text-(--foreground-secondary)">{seller.company_name}</p>

                {seller.seller_id === user?.id && (
                  <button
                    onClick={() => navigate("/seller/dashboard?tab=settings")}
                    className="mt-4 flex cursor-pointer items-center gap-2 bg-(--primary) px-5 py-2 text-white transition hover:bg-(--primary-hover)"
                  >
                    <Edit size={18} />
                    Edytuj sklep
                  </button>
                )}

                <p className="mt-3 text-sm text-(--foreground-secondary)">
                  Sprzedawca od {new Date(seller.created_at).toLocaleDateString("pl-PL")}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold text-(--foreground)">O sklepie</h2>

              <p className="leading-7 text-(--foreground-secondary)">{seller.description}</p>
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-(--foreground)">Produkty sprzedawcy</h2>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj produktu..."
                className="w-72 border border-(--border) bg-(--surface) p-3 text-(--foreground) outline-none focus:border-(--primary)"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products
                .filter((p: any) => p.id)
                .map((product: any) => (
                  <div
                    key={product.id}
                    className="overflow-hidden border border-(--border) bg-(--surface) shadow-sm transition hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center bg-(--surface-secondary) p-4">
                      <img src={useImage(product)} className="h-48 w-full object-contain" />
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-2 font-semibold text-(--foreground)">{product.name}</h3>

                      <p className="mt-3 text-2xl font-bold text-(--primary)">{product.price} zł</p>

                      <p className="mt-1 text-sm text-(--foreground-secondary)">Dostępne: {product.stock}</p>

                      {seller.seller_id === user?.id && (
                        <button
                          onClick={() => navigate(`/seller/dashboard?tab=products&edit=${product.id}`)}
                          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) py-2 text-white transition hover:bg-(--primary-hover)"
                        >
                          <Edit size={17} />
                          Edytuj produkt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </section>
        </div>
      </main>
    </>
  );
};
export default SellerPage;
