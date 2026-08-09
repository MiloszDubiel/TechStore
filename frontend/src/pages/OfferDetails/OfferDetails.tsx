import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
import { OrangeButton } from "../../components/ui/Buttons";

const OfferDetails = () => {
  const { slug, id } = useParams();
  const { user } = useAuth();
  const [openReport, setOpenReport] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const attributesRef = useRef<HTMLDivElement>(null);

  const [descriptionOverflow, setDescriptionOverflow] = useState(false);
  const [attributesOverflow, setAttributesOverflow] = useState(false);

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

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        setDescriptionOverflow(descriptionRef.current.scrollHeight >= descriptionRef.current.clientHeight);
      }

      if (attributesRef.current) {
        setAttributesOverflow(attributesRef.current.scrollHeight >= attributesRef.current.clientHeight);
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  });

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
      <main className="min-h-screen bg-(--background) py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="border border-(--border) bg-(--surface) p-6 shadow-sm">
                <img src={getImages()} alt={product.name} className="h-130 w-full object-contain" />
              </div>

              {product.images?.length > 1 && (
                <div className="mt-5 flex flex-wrap gap-4">
                  {product.images.map((img: any, index: number) => (
                    <button
                      key={img.image}
                      onClick={() => setSelectedImage(index)}
                      className={`border p-1 transition ${
                        selectedImage === index ? "border-orange-500" : "border-(--border) hover:border-orange-300"
                      }`}
                    >
                      <img src={getImages()} alt="" className="h-20 w-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="top-20 flex h-full flex-col justify-center border border-(--border) bg-(--surface) p-6 shadow-sm">
                <h1 className="text-3xl leading-tight font-bold text-(--foreground)">{product.name}</h1>

                <div className="mt-6 text-4xl font-bold text-orange-500">{Number(product.price).toFixed(2)} zł</div>

                <div className="mt-6 flex items-center justify-between gap-2">
                  <span className="p-4 text-(--foreground-secondary)">
                    Dostępność{" "}
                    <span className={`font-semibold ${product.stock ? "text-green-600" : "text-red-600"}`}>
                      {product.stock ? `${product.stock} szt.` : "Brak produktu"}
                    </span>
                  </span>

                  {product?.seller_id !== user?.id ||
                    (user && (
                      <button
                        disabled={!product.stock}
                        onClick={() => setOpenReport(true)}
                        className="flex w-full cursor-pointer items-center justify-center gap-3 bg-orange-500 p-4 font-semibold text-white transition hover:bg-orange-600"
                      >
                        <Flag size={18} />
                        Zgłoś
                      </button>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {product?.seller_id !== user?.id && (
                    <button
                      disabled={!product.stock}
                      onClick={() => {
                        addToCart(product);
                        toast.success("Dodano do koszuka");
                      }}
                      className="flex w-full cursor-pointer items-center justify-center gap-3 bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      <ShoppingCart size={20} />

                      {product.stock ? "Dodaj do koszyka" : "Brak produktu"}
                    </button>
                  )}

                  {product?.seller_id !== user?.id && user && (
                    <button
                      onClick={() => navigate(`/chat?seller_id=${product?.seller_id}`)}
                      className="flex w-full cursor-pointer items-center justify-center gap-3 border border-(--border) py-4 font-semibold text-(--foreground) transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      Napisz do sprzedawcy
                    </button>
                  )}

                  {product?.seller_id === user?.id && (
                    <button
                      onClick={() => navigate(`/seller/dashboard?tab=products&edit=${product.id}`)}
                      className="flex w-full cursor-pointer items-center justify-center gap-3 border border-(--border) bg-(--surface) py-4 font-semibold text-(--foreground) transition hover:bg-orange-400"
                    >
                      <Edit size={20} />
                      Edytuj produkt
                    </button>
                  )}
                </div>

                <div className="mt-6 border-t border-(--border) pt-5 text-sm text-(--foreground-secondary)">
                  Sprzedawca:
                  <span className="ml-2 font-semibold text-(--foreground)">{product.shop_name}</span>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-10 border border-(--border) bg-(--surface) p-6">
            <h2 className="mb-6 text-2xl font-semibold text-(--foreground)">Informacje podstawowe</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Marka", product.brand],
                ["Model", product.model],
                ["Kategoria", product.category_name],
                ["Podkategoria", product.subcategory_name],
              ].map(([name, value]) => (
                <div key={name} className="border border-(--border) p-4">
                  <p className="text-sm text-(--foreground-secondary)">{name}</p>

                  <p className="mt-1 font-medium text-(--foreground)">{value || "Brak"}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={descriptionRef}
            className={`relative mt-8 overflow-hidden border border-(--border) bg-(--surface) p-6 transition-[max-height] duration-500 ease-in-out ${showDescription ? "max-h-fit" : "max-h-125"} `}
          >
            <h2 className="mb-4 text-2xl font-semibold text-(--foreground)">Opis</h2>

            <p
              className="whitespace-pre-line text-(--foreground-secondary)"
              dangerouslySetInnerHTML={{
                __html: product?.description,
              }}
            />
          </section>

          {descriptionOverflow && (
            <section className="flex w-full justify-center border border-(--border) bg-(--surface) p-4">
              <OrangeButton
                onClick={() => {
                  setShowDescription((prev) => !prev);
                }}
              >
                {showDescription ? "Zobacz mniej" : "Zobacz więcej"}
              </OrangeButton>
            </section>
          )}

          {product.attributes?.length > 0 && (
            <>
              <section
                className={`mt-8 overflow-hidden border border-(--border) bg-(--surface) p-6 transition-[max-height] duration-500 ease-in-out ${showAttributes ? "max-h-fit" : "max-h-125"} `}
                ref={attributesRef}
              >
                <h2 className="mb-6 text-2xl font-semibold text-(--foreground)">Dane techniczne</h2>

                <div className="border border-(--border)">
                  {product.attributes.map((attr: any) => (
                    <div key={attr.name} className="grid grid-cols-2 border-b border-(--border) p-4">
                      <span className="font-medium text-(--foreground)">{attr.label}</span>

                      <span className="text-(--foreground-secondary)">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {attributesOverflow && (
                <section className="flex w-full justify-center border border-(--border) bg-(--surface) p-4">
                  <OrangeButton
                    onClick={() => {
                      setShowAttributes((prev) => !prev);
                    }}
                  >
                    {showAttributes ? "Zobacz mniej" : "Zobacz więcej"}
                  </OrangeButton>
                </section>
              )}
            </>
          )}

          <section className="mt-8 border border-(--border) bg-(--surface) p-6">
            <div className="mb-6 flex items-center gap-3">
              <Store className="text-orange-500" />

              <h2 className="text-2xl font-semibold text-(--foreground)">Sprzedawca</h2>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <img
                  src={
                    product.logo
                      ? `${import.meta.env.VITE_API_URL}uploads/sellers/${product.seller_id}/${product.logo}`
                      : "/shop-placeholder.png"
                  }
                  alt={product.shop_name}
                  className="h-24 w-24 border border-(--border) object-cover"
                />

                <div>
                  <h3 className="text-xl font-semibold text-(--foreground)">{product.shop_name || "Nieznany sklep"}</h3>

                  {product.company_name && <p className="mt-1 text-(--foreground-secondary)">{product.company_name}</p>}

                  <div className="mt-3 flex items-center gap-3">
                    {product.is_verified ? (
                      <span className="bg-green-100 px-3 py-1 text-sm text-green-700">Zweryfikowany sprzedawca</span>
                    ) : (
                      <span className="bg-orange-100 px-3 py-1 text-sm text-orange-700">Nowy sprzedawca</span>
                    )}
                  </div>

                  {product.seller_created_at && (
                    <p className="mt-3 text-sm text-(--foreground-secondary)">
                      Sprzedaje od: {new Date(product.seller_created_at).toLocaleDateString("pl-PL")}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate(`/seller/${product.slug}/${product.seller_id}`)}
                className="cursor-pointer bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
              >
                Zobacz sklep
              </button>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold text-(--foreground)">Opinie klientów</h2>

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
