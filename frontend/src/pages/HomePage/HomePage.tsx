import { api } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar/Navbar";
import { Link } from "react-router-dom";
import { useCartStore } from "../../zustand/states/cartState";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Edit } from "lucide-react";
import { useImage } from "../../hooks/useImage";
const HomePage = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuth();

  const fetchOffers = async () => {
    try {
      const response = await api.get("/api/products/products", {
        params: {
          limit: 4,
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const { data: data = {}, isLoading } = useQuery({
    queryKey: ["products-main-page"],
    queryFn: fetchOffers,
    staleTime: 5 * 60 * 1000,
  });

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <section className="py-16 text-center text-white bg-orange-500">
        <h1 className="mb-4 text-4xl font-bold">Aktualne Oferty</h1>
        <p className="text-lg">Najlepsze promocje w My IT Store</p>
      </section>

      <main className="container mx-auto flex-1 bg-(--background) px-6 py-12">
        <div className="sm:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-8">
          {isLoading &&
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-95 animate-pulse overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-sm"
              >
                <div className="h-48 w-full bg-(--surface-secondary)" />

                <div className="flex flex-col h-full p-4">
                  <div className="mb-3 h-5 w-3/4 rounded bg-(--surface-secondary)" />
                  <div className="mb-2 h-5 w-1/2 rounded bg-(--surface-secondary)" />
                  <div className="mt-auto mb-3 h-5 w-1/3 rounded bg-(--surface-secondary)" />
                  <div className="h-10 rounded bg-(--surface-secondary)" />
                </div>
              </div>
            ))}

          {!isLoading &&
            data?.products?.map((product: any) => (
              <Link
                key={product.id}
                to={`/offers/${product.slug}/${product.id}`}
              >
                <div className="hover:border-orange-500 flex h-95 flex-col overflow-hidden  border border-(--border) bg-(--surface) text-(--foreground) shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative flex h-52 items-center justify-center bg-(--surface-secondary)">
                    <img
                      src={useImage(product) || "/no-image.png"}
                      alt={product.name}
                      className="max-h-44 object-contain"
                    />

                    <span className="top-3 left-3 absolute px-3 py-1 text-xs text-white bg-orange-500 rounded-full">
                      PROMOCJA
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="line-clamp-2 min-h-14 hover:text-orange-500 text-lg font-semibold transition-colors">
                      {product.name}
                    </h3>

                    <div className="mb-2">
                      <span className="text-2xl font-bold text-orange-500">
                        {product.price} zł
                      </span>
                    </div>

                    <div className="mb-2 text-sm text-(--foreground-secondary)">
                      {product.stock} szt. dostępnych
                    </div>

                    {product?.seller_id != user?.id && (
                      <button
                        className="hover:bg-orange-600 w-full py-2 mt-auto font-medium text-white transition bg-orange-500 rounded-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Dodaj do koszyka
                      </button>
                    )}

                    {product?.seller_id == user?.id && (
                      <button
                        className=" hover:bg-orange-600 flex items-center justify-center w-full gap-2 py-2 mt-auto text-white transition bg-orange-500 cursor-pointer"
                        onClick={() => {
                          navigate(
                            `/seller/dashboard?tab=products&edit=${product.id}`
                          );
                        }}
                      >
                        <Edit size={18} />
                        Edytuj
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </main>
    </>
  );
};
export default HomePage;
