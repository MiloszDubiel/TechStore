import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import ReviewsList from "../layout/ReviewList";
import AddReview from "./AddReview";
import { useQuery } from "@tanstack/react-query";

const OfferDetails = () => {
  const { slug, id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllParams] = useState(false);
  const [showParamsDrawer, setShowParamsDrawer] = useState(false);

  const { user } = useAuth();
  const fetchOffer = async () => {
    try {
      const response = await axios.get(`/api/products/products/${slug}/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: product = [], isLoading } = useQuery({
    queryKey: ["product", id, slug],
    queryFn: fetchOffer,
    staleTime: 1000 * 5 * 60,
  });

  if (isLoading)
    return (
      <>
        <Navbar />
        <div className="max-w-6xl p-10 mx-auto text-lg text-center">
          Ładowanie produktu...
        </div>
      </>
    );

  if (!product)
    return (
      <>
        <Navbar />
        <div className="max-w-6xl p-10 mx-auto text-lg text-center">
          Nie znaleziono oferty
        </div>
      </>
    );

  const productData = product.product_data;
  const parameters = productData?.parameters || [];

  const visibleParameters = showAllParams ? parameters : parameters.slice(0, 5);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl p-6 mx-auto">
        <div className="lg:grid-cols-2 grid grid-cols-1 gap-12">
          <div>
            <img
              src={productData?.images?.[selectedImage]?.url || "/no-image.png"}
              alt={productData?.name}
              className="h-137.5  shadow-lg object-cover mb-4"
            />

            {productData?.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {productData?.images?.map((img: any, index: number) => (
                  <img
                    key={index}
                    src={img?.url}
                    alt=""
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 object-cover cursor-pointer border ${
                      selectedImage === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {productData?.name || "Brak nazwy produktu"}
            </h1>

            <p className="mt-4 text-3xl font-semibold text-orange-600">
              {product?.price ?? "—"} zł
            </p>

            <p className="mt-2 text-gray-500">
              Dostępne: {product?.stock ?? 0} szt.
            </p>

            <button
              disabled={!product?.stock}
              className="hover:bg-orange-600 disabled:bg-gray-300 w-full py-3 mt-6 text-lg font-semibold text-white transition bg-orange-500 cursor-pointer"
            >
              {product?.stock ? "Dodaj do koszyka" : "Brak w magazynie"}
            </button>

            {productData?.parameters?.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">Specyfikacja</h2>

                <div className="space-y-2">
                  {visibleParameters.map((param: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between pb-2 text-sm border-b border-gray-300"
                    >
                      <span className="text-gray-600">{param?.name}</span>
                      <span className="font-medium text-right">
                        {param?.valuesLabels?.join(", ") || "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {parameters.length > 5 && (
                  <button
                    onClick={() => setShowParamsDrawer(true)}
                    className="hover:underline mt-4 font-medium text-orange-600 cursor-pointer"
                  >
                    {showAllParams ? "Ukryj parametry" : "Wszystkie parametry"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {productData?.productSafety?.safetyInformation?.description && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-semibold">
              Informacje o bezpieczeństwie
            </h2>

            <p className="text-gray-700 whitespace-pre-line">
              {productData.productSafety.safetyInformation.description}
            </p>
          </div>
        )}
        <div className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold">Opinie klientów</h2>

          <ReviewsList productId={id as string} />

          {user && user.role === "USER" && (
            <div className="mt-10">
              <AddReview productId={id as string} />
            </div>
          )}
        </div>
      </div>
      {showParamsDrawer && (
        <>
          <div
            onClick={() => setShowParamsDrawer(false)}
            className="bg-black/40 fixed inset-0 z-40"
          />

          <div className="w-150 fixed top-0 left-0 z-50 flex flex-col h-full transition-transform duration-300 transform bg-white shadow-xl">
            <div className="shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Specyfikacja produktu</h2>

              <button
                onClick={() => setShowParamsDrawer(false)}
                className="hover:text-black text-xl text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-6 space-y-3 overflow-y-auto">
              {productData?.parameters?.map((param: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between pb-2 text-sm border-b border-gray-200"
                >
                  <span className="text-gray-600">{param?.name}</span>
                  <span className="font-medium text-right">
                    {param?.valuesLabels?.join(", ") || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OfferDetails;
