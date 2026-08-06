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
      ref={dropdownRef}
      className="
        absolute right-0 top-10 z-50 w-125
        border border-(--border)
        bg-(--surface)
        p-4
        text-(--foreground)
        shadow-xl
      "
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Powiadomienia</h3>

        {notifications?.length > 0 && (
          <button
            onClick={setAllAsRead}
            className=" hover:underline text-sm text-orange-500 transition cursor-pointer"
          >
            Odznacz wszystkie
          </button>
        )}
      </div>

      {notifications?.length === 0 ? (
        <p className="text-sm text-(--foreground-secondary)">
          Brak powiadomień
        </p>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {notifications?.map((notification: any) => (
            <div
              key={notification?.id}
              className={`
                border p-3 transition
                ${
                  notification?.is_read
                    ? "border-(--border) bg-(--surface)"
                    : "border-orange-500/40 bg-orange-500/10"
                }
              `}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium">{notification?.title}</p>

                  <p className="text-sm text-(--foreground-secondary)">
                    {notification?.message}
                  </p>
                </div>

                <button
                  onClick={() => setAsDeleted(notification?.id)}
                  className=" hover:text-red-400 text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="mt-2 text-xs text-(--foreground-secondary)">
                {new Date(notification?.created_at).toLocaleString("pl-PL")}
              </p>

              {!notification.is_read && (
                <button
                  onClick={() => setAsRead(notification?.id)}
                  className=" hover:underline mt-2 text-xs text-orange-500 transition cursor-pointer"
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
