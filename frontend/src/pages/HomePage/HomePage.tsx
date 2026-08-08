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
      <section className="bg-orange-500 py-16 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Aktualne Oferty</h1>
        <p className="text-lg">Najlepsze promocje w My IT Store</p>
      </section>

      <main className="container mx-auto flex-1 bg-(--background) px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-95 animate-pulse overflow-hidden border border-(--border) bg-(--surface) shadow-sm">
                <div className="h-48 w-full bg-(--surface-secondary)" />

                <div className="flex h-full flex-col p-4">
                  <div className="mb-3 h-5 w-3/4 bg-(--surface-secondary)" />
                  <div className="mb-2 h-5 w-1/2 bg-(--surface-secondary)" />
                  <div className="mt-auto mb-3 h-5 w-1/3 bg-(--surface-secondary)" />
                  <div className="h-10 bg-(--surface-secondary)" />
                </div>
              </div>
            ))}

          {!isLoading &&
            data?.products?.map((product: any) => (
              <Link key={product.id} to={`/offers/${product.slug}/${product.id}`}>
                <div className="flex h-95 flex-col overflow-hidden border border-(--border) bg-(--surface) text-(--foreground) shadow-sm transition-all hover:-translate-y-1 hover:border-orange-500 hover:shadow-xl">
                  <div className="relative flex h-52 items-center justify-center bg-(--surface-secondary)">
                    <img src={useImage(product) || "/no-image.png"} alt={product.name} className="max-h-44 object-contain" />

                    <span className="absolute top-3 left-3 bg-orange-500 px-3 py-1 text-xs text-white">PROMOCJA</span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 min-h-14 text-lg font-semibold transition-colors hover:text-orange-500">{product.name}</h3>

                    <div className="mb-2">
                      <span className="text-2xl font-bold text-orange-500">{product.price} zł</span>
                    </div>

                    <div className="mb-2 text-sm text-(--foreground-secondary)">{product.stock} szt. dostępnych</div>

                    {product?.seller_id != user?.id && (
                      <button
                        className="mt-auto w-full bg-orange-500 py-2 font-medium text-white transition hover:bg-orange-600"
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
                        className="mt-auto flex w-full cursor-pointer items-center justify-center gap-2 bg-orange-500 py-2 text-white transition hover:bg-orange-600"
                        onClick={() => {
                          navigate(`/seller/dashboard?tab=products&edit=${product.id}`);
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
