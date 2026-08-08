import { ArrowLeft, Package, Truck, CreditCard, User, MapPin } from "lucide-react";
import { useState } from "react";
import { useSeller } from "../../../../../hooks/useSeller";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { socket } from "../../../../../socket";
type Props = {
  orderId: number;
  onBack: () => void;
};

const OrderDetails = ({ orderId, onBack }: Props) => {
  const { getOrderDetails, updateOrderStatus } = useSeller();

  const { data: order, isLoading } = getOrderDetails(orderId);

  const [status, setStatus] = useState(order?.status);

  const clientQuery = useQueryClient();

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  if (!order) {
    return <p>Nie znaleziono</p>;
  }
  const orderStatusLabels: Record<string, string> = {
    NEW: "Nowe",
    PROCESSING: "W realizacji",
    SHIPPED: "Wysłane",
    COMPLETED: "Zakończone",
    CANCELLED: "Anulowane",
  };

  const saveStatus = () => {
    updateOrderStatus.mutate(
      {
        id: orderId,
        status,
      },
      {
        onSuccess: () => {
          socket.emit("changeStatus", {
            order_id: orderId,
            user: order?.user_id,
          });

          clientQuery.invalidateQueries({ queryKey: ["seller-orders"] });
          clientQuery.invalidateQueries({
            queryKey: ["seller-order-details", orderId],
          });
          toast.success("Zapisano status");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex cursor-pointer items-center gap-2 bg-orange-500 px-4 py-3 text-white hover:bg-orange-600">
        <ArrowLeft size={18} />
        Powrót
      </button>

      <section className="flex justify-between border border-(--border) bg-(--surface) p-6">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Zamówienie #{order.order_number}</h1>

          <p className="text-(--foreground-secondary)">{new Date(order.created_at).toLocaleString("pl-PL")}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-orange-100 px-4 py-2 text-orange-700">{orderStatusLabels[order.status]}</span>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-(--border) bg-(--surface) px-4 py-2 text-(--foreground)"
          >
            <option value="NEW">Nowe</option>
            <option value="PROCESSING">W realizacji</option>
            <option value="SHIPPED">Wysłane</option>
            <option value="COMPLETED">Zakończone</option>
            <option value="CANCELLED">Anulowane</option>
          </select>

          <button
            onClick={saveStatus}
            disabled={updateOrderStatus.isPending || status === order.status}
            className="cursor-pointer bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            Zapisz
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-(--border) bg-(--surface) p-6">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-(--foreground)">
            <User size={20} />
            Klient
          </h2>

          <p className="text-(--foreground)">
            Imię:
            <b className="ml-2">{order.customer.first_name}</b>
          </p>

          <p className="text-(--foreground)">
            Nazwisko:
            <b className="ml-2">{order.customer.last_name}</b>
          </p>

          <p className="text-(--foreground)">
            Telefon:
            <b className="ml-2">{order.customer.phone}</b>
          </p>
        </section>

        <section className="border border-(--border) bg-(--surface) p-6">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-(--foreground)">
            <Truck size={20} />
            Dostawa
          </h2>

          <p className="text-(--foreground)">
            Metoda:
            <b className="ml-2">{order.delivery.method === "LOCKER" ? "Paczkomat" : "Kurier"}</b>
          </p>

          <p className="text-(--foreground)">
            Cena:
            <b className="ml-2">{order.delivery.price} zł</b>
          </p>

          {order.delivery.locker ? (
            <div className="mt-4 bg-(--surface-secondary) p-4">
              <p className="text-(--foreground)">
                Paczkomat:
                <b className="ml-2">{order.delivery.locker.name}</b>
              </p>

              <p className="text-(--foreground)">
                Adres:
                <b className="ml-2">{order.delivery.locker.address}</b>
              </p>
            </div>
          ) : (
            <div className="mt-4 bg-(--surface-secondary) p-4 text-(--foreground)">
              <MapPin size={18} />

              <p>{order.customer.address.street}</p>

              <p>
                {order.customer.address.postal_code} {order.customer.address.city}
              </p>

              <p>{order.customer.address.country}</p>
            </div>
          )}
        </section>
      </div>

      <section className="border border-(--border) bg-(--surface) p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-(--foreground)">
          <CreditCard size={20} />
          Płatność
        </h2>

        <p className="text-(--foreground)">
          Metoda:
          <b className="ml-2">{order.payment_method}</b>
        </p>
      </section>

      <section className="border border-(--border) bg-(--surface) p-6">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-(--foreground)">
          <Package size={22} />
          Produkty
        </h2>

        <div className="space-y-5">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex gap-5 border border-(--border) p-4">
              <div className="flex gap-2">
                {item.images?.map((img: any) => (
                  <img key={img.id} src={`${import.meta.env.VITE_API_URL}${img.url}`} className="h-24 w-24 object-cover" />
                ))}
              </div>

              <div className="flex-1 text-(--foreground)">
                <h3 className="font-semibold">{item.name}</h3>

                <p>
                  Ilość:
                  <b className="ml-2">{item.quantity}</b>
                </p>

                <p>
                  Cena:
                  <b className="ml-2">{item.price} zł</b>
                </p>
              </div>

              <div className="text-xl font-bold text-(--foreground)">{(Number(item.price) * item.quantity).toFixed(2)} zł</div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex justify-end border border-(--border) bg-(--surface) p-6 text-2xl font-bold text-(--foreground)">
        Razem:
        <span className="ml-2 text-orange-600">{order.total_price} zł</span>
      </section>
    </div>
  );
};
export default OrderDetails;
