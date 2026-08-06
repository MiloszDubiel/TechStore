type Props = {
  onClick?: (data?: any) => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const GrayButton = ({ onClick, disabled = false, children }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        hover:bg-(--surface-secondary)
        px-6 py-3
        border border-(--border)
        bg-(--surface)
        text-(--foreground)
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        cursor-pointer
      "
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
