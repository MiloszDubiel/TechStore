import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useCheckout, type LockerData } from "../../../context/CheckoutContext";

// Import stylów Leaflet (wymagane!)
import "leaflet/dist/leaflet.css";

// Naprawa problemu z domyślnymi ikonami w React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const lockers: LockerData[] = [
  {
    id: "RZE01A",
    name: "Paczkomat RZE01A",
    address: "Rzeszów, ul. Hetmańska 10",
    position: [50.0413, 21.999],
  },
  {
    id: "RZE02B",
    name: "Paczkomat RZE02B",
    address: "Rzeszów, ul. Lisa-Kuli 5",
    position: [50.0375, 22.0045],
  },
  {
    id: "RZE03C",
    name: "Paczkomat RZE03C",
    address: "Rzeszów, ul. Rejtana 20",
    position: [50.022, 22.019],
  },
];

export default function ParcelLockerMap() {
  const { updateCheckout, checkoutData } = useCheckout();

  return (
    <div className="mt-6">
      <h3 className="mb-3 font-semibold">Wybierz paczkomat</h3>

      <MapContainer
        center={[50.0413, 21.999] as [number, number]}
        zoom={13}
        className="h-100 w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {lockers.map((locker) => (
          <Marker
            key={locker.id}
            position={locker.position as [number, number]}
          >
            <Popup>
              <div className="space-y-2">
                <p className="font-bold">{locker.name}</p>
                <p>{locker.address}</p>
                <button
                  className="hover:bg-orange-600 px-3 py-2 text-white transition-colors bg-orange-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCheckout({
                      delivery: {
                        method: "locker",
                        price: 12,
                        locker,
                      },
                    });
                  }}
                >
                  Wybierz
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {checkoutData.delivery?.locker && (
        <div className="bg-orange-50 p-4 mt-4 border border-orange-300">
          <p className="font-semibold">Wybrany paczkomat:</p>
          <p>{checkoutData.delivery.locker.name}</p>
          <p>{checkoutData.delivery.locker.address}</p>
        </div>
      )}
    </div>
  );
}
