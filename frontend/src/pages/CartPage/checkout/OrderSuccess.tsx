import { useCartStore } from "../../../zustand/states/cartState";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  order_number: string | null;
};

const OrderSuccess = ({ order_number }: Props) => {
  const clearCart = useCartStore((state) => state.clearCart);
  const querClient = useQueryClient();
  useEffect(() => {
    clearCart();
    querClient.invalidateQueries({ queryKey: ["products"] });
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-16">
      <div className="flex items-center justify-center mb-5">
        <CheckCircle size={72} className="text-green-500" />
      </div>

      <h1 className="mb-3 text-3xl font-bold text-gray-800">
        Zamówienie złożone!
      </h1>

      <p className="mb-6 text-gray-600">
        Dziękujemy za zakup. Twoje zamówienie zostało przyjęte do realizacji.
      </p>

      <div className="bg-gray-50 p-4 mb-6 border border-gray-200 rounded-lg">
        <p className="mb-1 text-sm text-gray-500">Numer zamówienia</p>

        <p className="text-xl font-bold text-orange-500">#{order_number}</p>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Na podany adres e-mail otrzymasz potwierdzenie zamówienia.
      </p>

      <Link
        to="/"
        className=" hover:bg-orange-600 inline-block px-6 py-3 font-medium text-white transition bg-orange-500 rounded-lg"
      >
        Wróć do sklepu
      </Link>
    </div>
  );
};
export default OrderSuccess;
