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
      className="cursor-pointer border border-(--border) bg-(--surface) px-6 py-3 text-(--foreground) transition hover:bg-(--surface-secondary) disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
};
export const OrangeButton = ({ onClick, disabled = false, children }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer bg-orange-500 px-6 py-3 text-white hover:bg-orange-600 disabled:bg-gray-300"
    >
      {children}
    </button>
  );
};
