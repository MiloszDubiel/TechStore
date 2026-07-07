type AddressCardProps = {
  title: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string | null | undefined;
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
  phone,
  isDefault,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex justify-between items-start">
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
          <p className="mt-2 text-gray-500">{phone}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="rounded-lg border px-3 py-2 hover:bg-gray-100"
          >
            Edytuj
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-50"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}

