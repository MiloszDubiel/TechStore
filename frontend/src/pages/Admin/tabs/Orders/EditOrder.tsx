import { ArrowLeft, Package, CreditCard, Truck, User, MapPin } from "lucide-react";
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
        <button onClick={onBack} className="flex items-center gap-2 bg-orange-500 px-4 py-3 text-white hover:bg-orange-600">
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
      },
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
      <button onClick={onBack} className="flex items-center gap-2 bg-orange-500 px-4 py-3 text-white transition hover:bg-orange-600">
        <ArrowLeft size={18} />
        Powrót
      </button>

      <div className="flex items-center justify-between border border-(--border) bg-(--surface) p-6">
        <div>
          <h1 className="text-2xl font-bold">Zamówienie #{order.order_number}</h1>

          <p className="text-(--foreground-secondary)">{new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColors[status]} `}>{status}</span>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-(--border) bg-(--surface-secondary) px-4 py-2 text-(--foreground) outline-none"
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
            className="bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {updateOrderStatus.isPending ? "Zapisywanie..." : "Zapisz"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="border border-(--border) bg-(--surface) p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <User size={20} />
            Klient
          </h2>

          <div className="space-y-2 text-(--foreground-secondary)">
            <p>
              Email:
              <b className="ml-2 text-(--foreground)">{order.customer?.email}</b>
            </p>

            <p>
              Imię:
              <b className="ml-2 text-(--foreground)">{order.customer?.first_name}</b>
            </p>

            <p>
              Nazwisko:
              <b className="ml-2 text-(--foreground)">{order.customer?.last_name}</b>
            </p>

            <p>
              Telefon:
              <b className="ml-2 text-(--foreground)">{order.customer?.phone}</b>
            </p>
          </div>
        </section>

        <section className="border border-(--border) bg-(--surface) p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <MapPin size={20} />
            Dostawa
          </h2>

          <div className="text-(--foreground-secondary)">
            <p>{order.customer?.street}</p>

            <p>
              {order.customer?.postal_code} {order.customer?.city}
            </p>

            <p>{order.customer?.country}</p>
          </div>

          <div className="mt-4 flex gap-2 text-(--foreground)">
            <Truck size={18} />
            <span>{order.delivery_method}</span>
          </div>
        </section>
      </div>

      <section className="border border-(--border) bg-(--surface) p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <CreditCard size={20} />
          Płatność
        </h2>

        <p className="text-(--foreground-secondary)">
          Metoda:
          <b className="ml-2 text-(--foreground)">{order.payment_method}</b>
        </p>

        <p className="text-(--foreground-secondary)">
          Dostawa:
          <b className="ml-2 text-(--foreground)">{order.delivery_price} zł</b>
        </p>
      </section>
    </div>
  );
};
export default OrderDetails;
