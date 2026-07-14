type Props = {
  message: React.ReactNode | string;
};

const NotificationCard = ({ message }: Props) => {
  return (
    <div className="bg-orange-50 p-4 mb-2 text-sm text-gray-700 border-l-4 border-orange-500">
      {message}
    </div>
  );
};

export default NotificationCard;
