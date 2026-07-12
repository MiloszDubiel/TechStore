import { GrayButton, OrangeButton } from "./Buttons";

type AddressCardProps = {
  title: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string | null | undefined;
  id: string;
  isDefault?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function AddressCard({
  title,
  street,
  postalCode,
  city,
  country,
  isDefault,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <div className=" bg-white p-6 shadow-sm mb-2 gap-2">
      <div className="flex justify-between items-center mb-2 gap-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>

            {isDefault && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                Domyślny
              </span>
            )}
          </div>

          <p>{street}</p>
          <p>
            {postalCode} {city}
          </p>
          <p>{country}</p>
        </div>

        <div className="flex gap-2">
          <GrayButton onClick={onEdit}> Edytuj</GrayButton>
          <OrangeButton onClick={onDelete}> Usuń</OrangeButton>
        </div>
      </div>
    </div>
  );
}
