import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle, Store, Edit } from "lucide-react";

import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

const SellerPage = () => {
  const { slug } = useParams();

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchSeller = async () => {
    const { data } = await axios.get(`/api/seller/${slug}/${user?.id}`);

    return data;
  };

  const { data: seller, isLoading } = useQuery({
    queryKey: ["seller", slug],
    queryFn: fetchSeller,
    enabled: !!slug,
  });

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

  const imageUrl = (productId: number, sellerId: number, image: string) =>
    `${import.meta.env.VITE_API_URL}
    uploads/products/${sellerId}/${productId}/${image}`;

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl px-6 mx-auto space-y-10">
          <section className="p-8 bg-white border border-gray-300">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-32 h-32 bg-gray-100 border">
                {seller.logo ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}
                      uploads/sellers/${seller.seller_id}/${seller.logo}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Store size={45} className="text-gray-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{seller.shop_name}</h1>

                  {seller.is_verified === 1 && (
                    <CheckCircle className="text-green-500" />
                  )}
                </div>

                <p className="mt-2 text-gray-600">{seller.company_name}</p>

                {seller.seller_id === user?.id && (
                  <button
                    onClick={() => navigate("/seller/dashboard?tab=settings")}
                    className=" hover:bg-orange-600 flex items-center gap-2 px-5 py-2 mt-4 text-white bg-orange-500"
                  >
                    <Edit size={18} />
                    Edytuj sklep
                  </button>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  Sprzedawca od:{" "}
                  {new Date(seller.created_at).toLocaleDateString("pl-PL")}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">O sklepie</h2>

              <p className="text-gray-700">{seller.description}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Produkty sprzedawcy</h2>

            <div className=" xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid grid-cols-1 gap-6">
              {seller.products
                .filter((p: any) => p.id)
                .map((product: any) => (
                  <div
                    key={product.id}
                    className="p-4 bg-white border border-gray-300"
                  >
                    <img
                      src={
                        product.images?.length
                          ? imageUrl(
                              product.id,
                              seller.seller_id,
                              product.images[0].image
                            )
                          : "/no-image.png"
                      }
                      className="object-contain w-full h-48"
                    />

                    <h3 className="mt-4 font-semibold">{product.name}</h3>

                    <p className="mt-2 text-xl font-bold text-orange-500">
                      {product.price} zł
                    </p>

                    <p className="text-sm text-gray-500">
                      Dostępne: {product.stock}
                    </p>

                    {seller.seller_id === user?.id && (
                      <button
                        onClick={() =>
                          navigate(
                            `/seller/dashboard?tab=products&edit=${product.id}`
                          )
                        }
                        className=" hover:bg-orange-600 flex items-center justify-center w-full gap-2 py-2 mt-4 text-white bg-orange-500"
                      >
                        <Edit size={17} />
                        Edytuj produkt
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default SellerPage;
