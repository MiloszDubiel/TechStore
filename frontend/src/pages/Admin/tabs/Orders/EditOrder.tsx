import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  User,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  orderId: number;
  onBack: () => void;
};

const OrderDetails = ({ orderId, onBack }: Props) => {
 

  const { updateOrderStatus, getAdminOrderDetails } = useAdmin();

  const { data: order, isLoading } = getAdminOrderDetails(orderId);
  const [status, setStatus] = useState(order?.status);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);
  if (isLoading) {
    return <div className="p-6">Ładowanie zamówienia...</div>;
  }

  if (!order) {
    return (
      <div className="p-6">
        <button
          onClick={onBack}
          className=" hover:bg-orange-600 flex items-center gap-2 px-4 py-3 text-white bg-orange-500"
        >
          <ArrowLeft size={18} />
          Powrót
        </button>
        Nie znaleziono zamówienia
      </div>
    );
  }

  const saveStatus = () => {
    updateOrderStatus.mutate(
      {
        id: order.order_id,
        status,
      },
      {
        onSuccess: () => {
          toast.success(`Zmieniono status zamówienia: ${order.order_number}`);
          onBack();
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        },
      }
    );
  };

  const statusColors: any = {
    NEW: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-orange-100 text-orange-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className=" hover:bg-orange-600 flex items-center gap-2 px-4 py-3 text-white bg-orange-500"
      >
        <ArrowLeft size={18} />
        Powrót
      </button>

      <div className="flex items-center justify-between p-6 bg-white border border-gray-300">
        <div>
          <h1 className="text-2xl font-bold">
            Zamówienie #{order.order_number}
          </h1>

          <p className="text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`
      px-3 py-1 rounded-full text-sm font-semibold
      ${statusColors[status]}
      `}
          >
            {status}
          </span>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300"
          >
            <option value="NEW">Nowe</option>

            <option value="PROCESSING">W realizacji</option>

            <option value="SHIPPED">Wysłane</option>

            <option value="COMPLETED">Zakończone</option>

            <option value="CANCELLED">Anulowane</option>
          </select>

          <button
            onClick={saveStatus}
            disabled={updateOrderStatus.isPending}
            className=" hover:bg-orange-600 disabled:opacity-50 px-4 py-2 text-white bg-orange-500"
          >
            {updateOrderStatus.isPending ? "Zapisywanie..." : "Zapisz"}
          </button>
        </div>
      </div>

      <div className="lg:grid-cols-2 grid gap-6">
        <section className="p-6 bg-white border border-gray-300">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
            <User size={20} />
            Klient
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              Email:
              <b className="ml-2">{order.customer?.email}</b>
            </p>

            <p>
              Imię:
              <b className="ml-2">{order.customer?.first_name}</b>
            </p>

            <p>
              Nazwisko:
              <b className="ml-2">{order.customer?.last_name}</b>
            </p>

            <p>
              Telefon:
              <b className="ml-2">{order.customer?.phone}</b>
            </p>
          </div>
        </section>

        <section className="p-6 bg-white border border-gray-300">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
            <MapPin size={20} />
            Dostawa
          </h2>

          <p>{order.customer?.street}</p>

          <p>
            {order.customer?.postal_code} {order.customer?.city}
          </p>

          <p>{order.customer?.country}</p>

          <div className="flex gap-2 mt-4">
            <Truck size={18} />

            <span>{order.delivery_method}</span>
          </div>
        </section>
      </div>

      <section className="p-6 bg-white border border-gray-300">
        <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
          <CreditCard size={20} />
          Płatność
        </h2>

        <p>
          Metoda:
          <b className="ml-2">{order.payment_method}</b>
        </p>

        <p>
          Dostawa:
          <b className="ml-2">{order.delivery_price} zł</b>
        </p>
      </section>

      <section className="p-6 bg-white border border-gray-300">
        <h2 className="flex items-center gap-2 mb-5 text-xl font-semibold">
          <Package size={22} />
          Produkty
        </h2>

        <div className="space-y-4">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className=" flex items-center gap-5 p-4 border border-gray-300"
            >
              {item.image ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${item.image}`}
                  className=" object-cover w-24 h-24"
                />
              ) : (
                <div className=" flex items-center justify-center w-24 h-24 bg-gray-100">
                  Brak
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold">{item.product_name}</h3>

                <p>
                  Ilość:
                  <b className="ml-2">{item.quantity}</b>
                </p>

                <p>
                  Cena:
                  <b className="ml-2">{item.price} zł</b>
                </p>
              </div>

              <div className="text-lg font-bold">
                {(item.price * item.quantity).toFixed(2)} zł
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className=" flex justify-end p-6 text-2xl font-bold bg-white border border-gray-300">
        Razem:
        <span className="ml-2 text-orange-600">{order.total_price} zł</span>
      </div>
    </div>
  );
};
export default OrderDetails;
