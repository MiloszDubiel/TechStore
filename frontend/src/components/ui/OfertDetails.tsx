import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../layout/Navbar/Navbar";
import ReviewsList from "../layout/ReviewList";
import AddReview from "./AddReview";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "../../zustand/states/cartState";
import { ShoppingCart, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Edit } from "lucide-react";

const OfferDetails = () => {
  const { slug, id } = useParams();
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);

  const addToCart = useCartStore((state) => state.addToCart);

  const fetchOffer = async () => {
    const { data } = await axios.get(`/api/products/products/${slug}/${id}`);

    return data;
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id, slug],
    queryFn: fetchOffer,
  });

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

  const imageUrl = (image: string) =>
    `${import.meta.env.VITE_API_URL}uploads/products/${product.seller_id}/${
      product.id
    }/${image}`;

  return (
    <>
      <Navbar />

      <main className=" bg-gray-50 min-h-screen py-10">
        <div className=" max-w-7xl px-6 mx-auto">
          <div className="lg:grid-cols-12 grid gap-10">
  
            <div className="lg:col-span-7">
              <div className="p-6 bg-white border border-gray-300 shadow-sm">
                <img
                  src={
                    product.images?.[selectedImage]
                      ? imageUrl(product.images[selectedImage].image)
                      : "/no-image.png"
                  }
                  alt={product.name}
                  className="
          w-full
          h-[520px]
          object-contain
        "
                />
              </div>

              {product.images?.length > 1 && (
                <div className="flex flex-wrap gap-4 mt-5">
                  {product.images.map((img: any, index: number) => (
                    <button
                      key={img.image}
                      onClick={() => setSelectedImage(index)}
                      className={`
              p-1
              border
              transition
              ${
                selectedImage === index
                  ? "border-orange-500"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
                    >
                      <img
                        src={imageUrl(img.image)}
                        alt=""
                        className=" object-cover w-20 h-20"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="lg:col-span-5">
              <div className=" top-20 sticky p-6 bg-white border border-gray-300 shadow-sm">
                <h1 className=" text-3xl font-bold leading-tight text-gray-900">
                  {product.name}
                </h1>

                <div className=" mt-6 text-4xl font-bold text-orange-500">
                  {Number(product.price).toFixed(2)} zł
                </div>

                <div className=" bg-gray-50 flex items-center justify-between p-4 mt-6 border border-gray-200">
                  <span className="text-gray-600">Dostępność</span>

                  <span
                    className={`
            font-semibold
            ${product.stock > 0 ? "text-green-600" : "text-red-600"}
          `}
                  >
                    {product.stock > 0
                      ? `${product.stock} szt.`
                      : "Brak produktu"}
                  </span>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  {product?.seller_id !== user?.id && (
                    <button
                      disabled={!product.stock}
                      onClick={() => addToCart(product)}
                      className=" disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 flex items-center justify-center w-full gap-3 py-4 font-semibold text-white transition bg-orange-500"
                    >
                      <ShoppingCart size={20} />

                      {product.stock ? "Dodaj do koszyka" : "Brak produktu"}
                    </button>
                  )}

                  {product?.seller_id !== user?.id && user && (
                    <button
                      onClick={() => {
                        navigate("/chat", {
                          state: { seller_id: product.seller_id },
                        });
                      }}
                      className=" disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-500 hover:text-white hover:border-b-orange-500 flex items-center justify-center w-full gap-3 py-4 font-semibold text-black transition border border-gray-300 cursor-pointer"
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
                      className=" hover:bg-orange-400 flex items-center justify-center w-full gap-3 py-4 font-semibold text-gray-900 transition bg-white border border-gray-300"
                    >
                      <Edit size={20} />
                      Edytuj produkt
                    </button>
                  )}
                </div>

                <div className=" pt-5 mt-6 text-sm text-gray-500 border-t border-gray-200">
                  Sprzedawca:
                  <span className=" ml-2 font-semibold text-gray-900">
                    {product.shop_name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <section className=" p-6 mt-10 bg-white border border-gray-300">
            <h2 className=" mb-6 text-2xl font-semibold">
              Informacje podstawowe
            </h2>

            <div className=" md:grid-cols-2 grid gap-4">
              {[
                ["Marka", product.brand],
                ["Model", product.model],
                ["Kategoria", product.category_name],
                ["Podkategoria", product.subcategory_name],
              ].map(([name, value]) => (
                <div key={name} className=" p-4 border border-gray-200">
                  <p className=" text-sm text-gray-500">{name}</p>

                  <p className=" mt-1 font-medium">{value || "Brak"}</p>
                </div>
              ))}
            </div>
          </section>

          <section className=" p-6 mt-8 bg-white border border-gray-300">
            <h2 className=" mb-4 text-2xl font-semibold">Opis</h2>

            <p className=" text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </section>

          {product.attributes?.length > 0 && (
            <section className=" p-6 mt-8 bg-white border border-gray-300">
              <h2 className=" mb-6 text-2xl font-semibold">Dane techniczne</h2>

              <div className=" border border-gray-200">
                {product.attributes.map((attr: any) => (
                  <div
                    key={attr.name}
                    className=" grid grid-cols-2 p-4 border-b border-gray-200"
                  >
                    <span className="font-medium">{attr.name}</span>

                    <span className="text-gray-600">{attr.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="p-6 mt-8 bg-white border border-gray-300">
            <div className="flex items-center gap-3 mb-6">
              <Store className="text-orange-500" />

              <h2 className="text-2xl font-semibold">Sprzedawca</h2>
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
                  className=" object-cover w-24 h-24 border border-gray-300"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    {product.shop_name || "Nieznany sklep"}
                  </h3>

                  {product.company_name && (
                    <p className="mt-1 text-gray-600">{product.company_name}</p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    {product.is_verified ? (
                      <span className=" px-3 py-1 text-sm text-green-700 bg-green-100">
                        Zweryfikowany sprzedawca
                      </span>
                    ) : (
                      <span className=" px-3 py-1 text-sm text-orange-700 bg-orange-100">
                        Nowy sprzedawca
                      </span>
                    )}
                  </div>

                  {product.seller_created_at && (
                    <p className="mt-3 text-sm text-gray-500">
                      Sprzedaje od:{" "}
                      {new Date(product.seller_created_at).toLocaleDateString(
                        "pl-PL"
                      )}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  navigate(`/seller/${product.slug}/${product.seller_id}`);
                }}
                className=" hover:bg-orange-600 px-6 py-3 text-white bg-orange-500"
              >
                Zobacz sklep
              </button>
            </div>
          </section>

          <section className=" mt-12">
            <h2 className=" mb-6 text-2xl font-semibold">Opinie klientów</h2>
            <AddReview productId={id as string} seller_id={product.seller_id} />
            <ReviewsList productId={id as string} />
          </section>
        </div>
      </main>
    </>
  );
};
export default OfferDetails;
