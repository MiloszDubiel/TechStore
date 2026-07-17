import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar/Navbar";
import { Link } from "react-router-dom";
import { useCartStore } from "../../zustand/states/cartState";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Edit } from "lucide-react";
const HomePage = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuth();

  const fetchOffers = async () => {
    try {
      const response = await axios.get("/api/products/products");
      return response.data.slice(0, 4);
    } catch (err) {
      console.error(err);
    }
  };

  const { data: products = [], isLoading } = useQuery({
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

      <main className="container flex-1 px-6 py-12 mx-auto">
        <div className="sm:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-8">
          {isLoading &&
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-95 animate-pulse flex flex-col overflow-hidden bg-white shadow-md"
              >
                <div className="object-cover w-full h-48 bg-gray-300" />
                <div className="flex flex-col flex-1 p-4">
                  <div className="w-3/4 h-5 mb-2 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-5 mb-2 bg-gray-300 rounded"></div>
                  <div className="w-1/3 h-5 mt-auto mb-2 bg-gray-300 rounded"></div>
                  <div className="h-10 mt-2 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}

          {!isLoading &&
            products.map((product: any) => (
              <Link
                key={product.id}
                to={`/offers/${product.slug}/${product.id}`}
              >
                <div className="hover:shadow-xl h-95 flex flex-col overflow-hidden transition bg-white shadow-md">
                  <div className="relative flex justify-center">
                    <img
                      src={
                        product.images?.[0]
                          ? `${import.meta.env.VITE_API_URL}uploads/products/${
                              product.seller_id
                            }/${product.id}/${product.images[0].image}`
                          : "/no-image.png"
                      }
                      alt={product.name}
                      className="object-cover h-48"
                    />

                    <span className="top-3 left-3 absolute px-3 py-1 text-xs text-white bg-orange-500 rounded-full">
                      PROMOCJA
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="line-clamp-2 min-h-14 hover:underline hover:text-orange-600 mb-2 text-lg font-semibold">
                      {product.name}
                    </h3>

                    <div className="mb-2">
                      <span className="text-xl font-bold text-orange-500">
                        {product.price} zł
                      </span>
                    </div>

                    <div className="mb-2 text-sm text-gray-500">
                      {product.stock} szt. dostępnych
                    </div>

                    {product?.seller_id != user?.id && (
                      <button
                        className=" hover:bg-orange-600 w-full py-2 mt-auto text-white transition bg-orange-500 cursor-pointer"
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
