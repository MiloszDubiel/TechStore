type Props = {
  message: React.ReactNode | string;
};

const NotificationCard = ({ message }: Props) => {
  return (
    <div className="p-4 border-l-4 border-orange-500 bg-orange-50 text-sm text-gray-700 mb-2">
      {message}
    </div>
  );
};

export default NotificationCard;
