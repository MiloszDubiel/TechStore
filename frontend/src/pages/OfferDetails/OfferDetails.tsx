import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../../axios";
import Navbar from "../../components/layout/Navbar/Navbar";
import ReviewsList from "../../components/layout/ReviewList";
import AddReview from "../../components/ui/AddReview";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCartStore } from "../../zustand/states/cartState";
import { ShoppingCart, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Edit, Flag } from "lucide-react";
import ReportOffer from "../../components/ui/ReportOffert";
import { toast } from "react-toastify";

const OfferDetails = () => {
  const { slug, id } = useParams();
  const { user } = useAuth();
  const [openReport, setOpenReport] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const addToCart = useCartStore((state) => state.addToCart);

  const fetchOffer = async () => {
    const { data } = await api.get(`/api/products/products/${slug}/${id}`);

    return data;
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id, slug],
    queryFn: fetchOffer,
  });

  const { mutate: sendReport } = useMutation({
    mutationFn: (data) => api.post("/api/report/", data),
  });

  const getImages = () => {
    if (!product?.images[0].url) return [];

    return product.images.map((img: any) => {
      if (img?.url?.includes("http")) return img.url;

      return `${import.meta.env.VITE_API_URL}${img.url}`;
    });
  };

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">Ładowanie produktu...</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">Nie znaleziono produktu</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-(--background) min-h-screen py-10">
        <div className="max-w-7xl px-6 mx-auto">
          <div className="lg:grid-cols-12 grid gap-10">
            <div className="lg:col-span-7">
              <div className="p-6 bg-(--surface) border border-(--border) shadow-sm">
                <img
                  src={getImages()}
                  alt={product.name}
                  className="h-130 object-contain w-full"
                />
              </div>

              {product.images?.length > 1 && (
                <div className="flex flex-wrap gap-4 mt-5">
                  {product.images.map((img: any, index: number) => (
                    <button
                      key={img.image}
                      onClick={() => setSelectedImage(index)}
                      className={`p-1 border transition ${
                        selectedImage === index
                          ? "border-orange-500"
                          : "border-(--border) hover:border-orange-300"
                      }`}
                    >
                      <img
                        src={getImages()}
                        alt=""
                        className="object-cover w-20 h-20"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="top-20 sticky p-6 bg-(--surface) border border-(--border) shadow-sm">
                <h1 className="text-3xl font-bold leading-tight text-(--foreground)">
                  {product.name}
                </h1>

                <div className="mt-6 text-4xl font-bold text-orange-500">
                  {Number(product.price).toFixed(2)} zł
                </div>

                <div className="flex items-center justify-between gap-2 mt-6">
                  <span className="p-4 text-(--foreground-secondary)">
                    Dostępność{" "}
                    <span
                      className={`font-semibold ${
                        product.stock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock
                        ? `${product.stock} szt.`
                        : "Brak produktu"}
                    </span>
                  </span>

                  {product?.seller_id !== user?.id && (
                    <button
                      disabled={!product.stock}
                      onClick={() => setOpenReport(true)}
                      className="hover:bg-orange-600 flex items-center justify-center w-full gap-3 p-4 font-semibold text-white transition bg-orange-500 cursor-pointer"
                    >
                      <Flag size={18} />
                      Zgłoś
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  {product?.seller_id !== user?.id && (
                    <button
                      disabled={!product.stock}
                      onClick={() => addToCart(product)}
                      className="disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 flex items-center justify-center w-full gap-3 py-4 font-semibold text-white transition bg-orange-500 cursor-pointer"
                    >
                      <ShoppingCart size={20} />

                      {product.stock ? "Dodaj do koszyka" : "Brak produktu"}
                    </button>
                  )}

                  {product?.seller_id !== user?.id && user && (
                    <button
                      onClick={() =>
                        navigate(`/chat?seller_id=${product?.seller_id}`)
                      }
                      className="hover:bg-orange-500 hover:text-white hover:border-orange-500 flex items-center justify-center w-full gap-3 py-4 font-semibold text-(--foreground) transition border border-(--border) cursor-pointer"
                    >
                      Napisz do sprzedawcy
                    </button>
                  )}

                  {product?.seller_id === user?.id && (
                    <button
                      onClick={() =>
                        navigate(
                          `/seller/dashboard?tab=products&edit=${product.id}`
                        )
                      }
                      className="hover:bg-orange-400 flex items-center justify-center w-full gap-3 py-4 font-semibold text-(--foreground) transition bg-(--surface) border border-(--border) cursor-pointer"
                    >
                      <Edit size={20} />
                      Edytuj produkt
                    </button>
                  )}
                </div>

                <div className="pt-5 mt-6 text-sm text-(--foreground-secondary) border-t border-(--border)">
                  Sprzedawca:
                  <span className="ml-2 font-semibold text-(--foreground)">
                    {product.shop_name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <section className="p-6 mt-10 bg-(--surface) border border-(--border)">
            <h2 className="mb-6 text-2xl font-semibold text-(--foreground)">
              Informacje podstawowe
            </h2>

            <div className="md:grid-cols-2 grid gap-4">
              {[
                ["Marka", product.brand],
                ["Model", product.model],
                ["Kategoria", product.category_name],
                ["Podkategoria", product.subcategory_name],
              ].map(([name, value]) => (
                <div key={name} className="p-4 border border-(--border)">
                  <p className="text-sm text-(--foreground-secondary)">
                    {name}
                  </p>

                  <p className="mt-1 font-medium text-(--foreground)">
                    {value || "Brak"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 mt-8 bg-(--surface) border border-(--border)">
            <h2 className="mb-4 text-2xl font-semibold text-(--foreground)">
              Opis
            </h2>

            <p
              className="text-(--foreground-secondary) whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          </section>

          {product.attributes?.length > 0 && (
            <section className="p-6 mt-8 bg-(--surface) border border-(--border)">
              <h2 className="mb-6 text-2xl font-semibold text-(--foreground)">
                Dane techniczne
              </h2>

              <div className="border border-(--border)">
                {product.attributes.map((attr: any) => (
                  <div
                    key={attr.name}
                    className="grid grid-cols-2 p-4 border-b border-(--border)"
                  >
                    <span className="font-medium text-(--foreground)">
                      {attr.label}
                    </span>

                    <span className="text-(--foreground-secondary)">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
     
          <section className="p-6 mt-8 bg-(--surface) border border-(--border)">
            <div className="flex items-center gap-3 mb-6">
              <Store className="text-orange-500" />

              <h2 className="text-2xl font-semibold text-(--foreground)">
                Sprzedawca
              </h2>
            </div>

            <div className="md:flex-row md:items-center md:justify-between flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={
                    product.logo
                      ? `${import.meta.env.VITE_API_URL}uploads/sellers/${
                          product.seller_id
                        }/${product.logo}`
                      : "/shop-placeholder.png"
                  }
                  alt={product.shop_name}
                  className="object-cover w-24 h-24 border border-(--border)"
                />

                <div>
                  <h3 className="text-xl font-semibold text-(--foreground)">
                    {product.shop_name || "Nieznany sklep"}
                  </h3>

                  {product.company_name && (
                    <p className="mt-1 text-(--foreground-secondary)">
                      {product.company_name}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    {product.is_verified ? (
                      <span className="px-3 py-1 text-sm text-green-700 bg-green-100">
                        Zweryfikowany sprzedawca
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm text-orange-700 bg-orange-100">
                        Nowy sprzedawca
                      </span>
                    )}
                  </div>

                  {product.seller_created_at && (
                    <p className="mt-3 text-sm text-(--foreground-secondary)">
                      Sprzedaje od:{" "}
                      {new Date(product.seller_created_at).toLocaleDateString(
                        "pl-PL"
                      )}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/seller/${product.slug}/${product.seller_id}`)
                }
                className="hover:bg-orange-600 px-6 py-3 text-white bg-orange-500 cursor-pointer"
              >
                Zobacz sklep
              </button>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold text-(--foreground)">
              Opinie klientów
            </h2>

            <AddReview productId={id as string} seller_id={product.seller_id} />

            <ReviewsList productId={id as string} />
          </section>
        </div>

        <ReportOffer
          open={openReport}
          onClose={() => setOpenReport(false)}
          product={product}
          onSubmit={(data: any) => {
            sendReport(data, {
              onSuccess: () => {
                toast.success("Wysłano zgłoszenie");
              },
            });
          }}
        />
      </main>
    </>
  );
};
export default OfferDetails;
