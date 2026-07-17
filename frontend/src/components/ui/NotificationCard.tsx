import { useNotificationStore } from "../../zustand/states/NotificationState";

const NotificationCard = () => {
  const { message, type, isVisible } = useNotificationStore();

  if (!isVisible) return null;

  const colors = {
    success: "bg-green-50 border-green-500 text-green-700",
    error: "bg-red-50 border-red-500 text-red-700",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
    info: "bg-orange-50 border-orange-500 text-gray-700",
  };

  return (
    <div className="top-5 right-5 z-999 w-96 fixed">
      <div
        className={`border-l-4 shadow-lg p-4 rounded bg-white ${colors[type]}`}
      >
        {message}
      </div>
    </div>
  );
};

export default NotificationCard;
