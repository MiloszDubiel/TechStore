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

export default function AddressCard({ title, street, postalCode, city, country, isDefault, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="mb-2 gap-2 border border-(--border) bg-(--surface) p-6 text-(--foreground) shadow-sm">
      <div className="mb-2 items-center justify-between gap-2 md:flex">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-semibold">{title}</h3>

            {isDefault && <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs text-green-500">Domyślny</span>}
          </div>

          <p>{street}</p>

          <p className="text-(--foreground-secondary)">
            {postalCode} {city}
          </p>

          <p className="text-(--foreground-secondary)">{country}</p>
        </div>

        <div className="flex gap-2">
          <GrayButton onClick={onEdit}>Edytuj</GrayButton>

          <OrangeButton onClick={onDelete}>Usuń</OrangeButton>
        </div>
      </div>
    </div>
  );
}
