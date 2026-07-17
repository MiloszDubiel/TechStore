type Props = {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const GrayButton = ({ onClick, disabled = false, children }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className=" hover:bg-gray-100 px-6 py-3 border border-gray-200 cursor-pointer"
    >
      {children}
    </button>
  );
};
export const OrangeButton = ({
  onClick,
  disabled = false,
  children,
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className=" hover:bg-orange-600 disabled:bg-gray-300 px-6 py-3 text-white bg-orange-500 cursor-pointer"
    >
      {children}
    </button>
  );
};
