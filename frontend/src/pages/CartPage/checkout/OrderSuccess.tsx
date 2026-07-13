import { useCartStore } from "../../../zustand/states/cartState";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  orderId: string | null;
};

const OrderSuccess = ({ orderId }: Props) => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex justify-center items-center flex-col py-16">
      <div className="flex justify-center items-center mb-5">
        <CheckCircle size={72} className="text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        Zamówienie złożone!
      </h1>

      <p className="text-gray-600 mb-6">
        Dziękujemy za zakup. Twoje zamówienie zostało przyjęte do realizacji.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500 mb-1">Numer zamówienia</p>

        <p className="text-xl font-bold text-orange-500">#{orderId}</p>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Na podany adres e-mail otrzymasz potwierdzenie zamówienia.
      </p>

      <Link
        to="/"
        className="
            inline-block
            bg-orange-500
            text-white
            px-6
            py-3
            rounded-lg
            font-medium
            hover:bg-orange-600
            transition
          "
      >
        Wróć do sklepu
      </Link>
    </div>
  );
};

export default OrderSuccess;
