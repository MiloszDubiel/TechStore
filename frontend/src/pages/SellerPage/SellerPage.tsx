import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../axios";
import { CheckCircle, Store, Edit } from "lucide-react";
import { useImage } from "../../hooks/useImage";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import Pagination from "../../components/ui/Pagination";

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

  const filteredProducts = seller.products.filter((product: any) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / limit);

  const products = filteredProducts.slice((page - 1) * limit, page * limit);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <p className="p-10 text-center">Ładowanie sklepu...</p>
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
      <main className="min-h-screen py-10 bg-(--background)">
        <div className="max-w-7xl px-6 mx-auto space-y-10">
          <section className="p-8 border bg-(--surface) border-(--border)">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-32 h-32 border bg-(--surface-secondary) border-(--border)">
                {seller.logo ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}uploads/sellers/${
                      seller.seller_id
                    }/${seller.logo}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Store size={45} className="text-(--foreground-secondary)" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-(--foreground)">
                    {seller.shop_name}
                  </h1>

                  {seller.is_verified === 1 && (
                    <CheckCircle className="text-(--success)" />
                  )}
                </div>

                <p className="mt-2 text-(--foreground-secondary)">
                  {seller.company_name}
                </p>

                {seller.seller_id === user?.id && (
                  <button
                    onClick={() => navigate("/seller/dashboard?tab=settings")}
                    className="
                flex
                items-center
                gap-2
                px-5
                py-2
                mt-4
                text-white
                transition
                cursor-pointer
                bg-(--primary)
                hover:bg-(--primary-hover)
              "
                  >
                    <Edit size={18} />
                    Edytuj sklep
                  </button>
                )}

                <p className="mt-3 text-sm text-(--foreground-secondary)">
                  Sprzedawca od{" "}
                  {new Date(seller.created_at).toLocaleDateString("pl-PL")}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold text-(--foreground)">
                O sklepie
              </h2>

              <p className="leading-7 text-(--foreground-secondary)">
                {seller.description}
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-(--foreground)">
                Produkty sprzedawcy
              </h2>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj produktu..."
                className="
      w-72
      p-3
      border
      bg-(--surface)
      border-(--border)
      text-(--foreground)
      outline-none
      focus:border-(--primary)
    "
              />
            </div>

            <div className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid grid-cols-1 gap-6">
              {products
                .filter((p: any) => p.id)
                .map((product: any) => (
                  <div
                    key={product.id}
                    className="
                overflow-hidden
                transition
                border
                shadow-sm
                bg-(--surface)
                border-(--border)
                hover:shadow-lg
              "
                  >
                    <div className="flex items-center justify-center p-4 bg-(--surface-secondary)">
                      <img
                        src={useImage(product)}
                        className="object-contain w-full h-48"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 text-(--foreground)">
                        {product.name}
                      </h3>

                      <p className="mt-3 text-2xl font-bold text-(--primary)">
                        {product.price} zł
                      </p>

                      <p className="mt-1 text-sm text-(--foreground-secondary)">
                        Dostępne: {product.stock}
                      </p>

                      {seller.seller_id === user?.id && (
                        <button
                          onClick={() =>
                            navigate(
                              `/seller/dashboard?tab=products&edit=${product.id}`
                            )
                          }
                          className="
                      flex
                      items-center
                      justify-center
                      w-full
                      gap-2
                      py-2
                      mt-4
                      text-white
                      transition
                      cursor-pointer
                      bg-(--primary)
                      hover:bg-(--primary-hover)
                    "
                        >
                          <Edit size={17} />
                          Edytuj produkt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>
        </div>
      </main>
    </>
  );
};
export default SellerPage;
