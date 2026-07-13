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
      className="
            border 
            border-gray-200 
            px-6 
            py-3
            cursor-pointer
            hover:bg-gray-100
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
      className="
             
            bg-orange-500
            hover:bg-orange-600
            
            text-white
            px-6
            py-3
            disabled:bg-gray-300
            cursor-pointer
          "
    >
      {children}
    </button>
  );
};
