import { useCartStore } from "../../../zustand/states/cartState";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  orderNumber: string | null;
};

const OrderSuccess = ({ orderNumber }: Props) => {
  const clearCart = useCartStore((state) => state.clearCart);
  const querClient = useQueryClient();
  useEffect(() => {
    clearCart();
    querClient.invalidateQueries({ queryKey: ["products"] });
  }, [clearCart]);

  return (
    <div className="flex w-full flex-col items-center justify-center py-16">
      <div className="mb-5 flex items-center justify-center">
        <CheckCircle size={72} className="text-green-500" />
      </div>

      <h1 className="mb-3 text-3xl font-bold text-(--text)">Zamówienie złożone!</h1>

      <p className="mb-6 text-(--text-muted)">Dziękujemy za zakup. Twoje zamówienie zostało przyjęte do realizacji.</p>

      <div className="mb-6 border border-(--border) bg-(--surface) p-4">
        <p className="mb-1 text-sm text-(--text-muted)">Numer zamówienia</p>

        <p className="text-xl font-bold text-orange-500">#{orderNumber}</p>
      </div>

      <p className="mb-6 text-sm text-(--text-muted)">Na podany adres e-mail otrzymasz potwierdzenie zamówienia.</p>

      <Link to="/" className="inline-block bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600">
        Wróć do sklepu
      </Link>
    </div>
  );
};
export default OrderSuccess;
