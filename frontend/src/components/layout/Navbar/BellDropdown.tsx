import { useRef, useEffect } from "react";
import { useNotification } from "../../../context/NotificationContext";
import { Trash2 } from "lucide-react";

const BellDropdown = ({ onClose, notifications = [] }: any) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setAsDeleted, setAsRead, setAllAsRead } = useNotification();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="top-10 w-125 absolute right-0 z-50 p-4 bg-white border border-gray-300 shadow-xl"
      ref={dropdownRef}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Powiadomienia</h3>

        {notifications?.length > 0 && (
          <button
            onClick={setAllAsRead}
            className="hover:underline text-sm text-red-500 cursor-pointer"
          >
            Odznacz wszytskie
          </button>
        )}
      </div>

      {notifications?.length === 0 ? (
        <p className="text-sm text-gray-500">Brak powiadomień</p>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {notifications?.map((notification: any) => (
            <div
              key={notification?.id}
              className={`p-3 border ${
                notification?.is_read
                  ? "border-gray-200 bg-white"
                  : "border-orange-300 bg-orange-50"
              }`}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium">{notification?.title}</p>

                  <p className="text-sm text-gray-600">
                    {notification?.message}
                  </p>
                </div>

                <button
                  onClick={() => setAsDeleted(notification?.id)}
                  className="hover:underline text-sm text-red-500 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(notification?.created_at).toLocaleString("pl-PL")}
              </p>

              {!notification.is_read && (
                <button
                  onClick={() => setAsRead(notification?.id)}
                  className="hover:underline mt-2 text-xs text-orange-500 cursor-pointer"
                >
                  Oznacz jako przeczytane
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BellDropdown;
