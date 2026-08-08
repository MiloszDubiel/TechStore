import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { OrangeButton } from "./Buttons";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; description: string; product_id: string }) => void;
  product: any;
};

const ReportOffer = ({ open, onClose, onSubmit, product }: Props) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  if (!open) return null;

  const submit = () => {
    let valid = true;

    if (!reason) {
      setReasonError("Wybierz powód zgłoszenia.");
      valid = false;
    } else {
      setReasonError("");
    }

    if (!description.trim()) {
      setDescriptionError("Opisz problem.");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (!valid) return;

    onSubmit({
      reason,
      description,
      product_id: product.id,
    });

    setReason("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl border border-(--border) bg-(--surface) text-(--foreground) shadow-xl">
        <div className="flex items-center justify-between border-b border-(--border) p-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/15 p-2 text-red-500">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">Zgłoś ofertę</h2>

              <p className="text-sm text-(--foreground-secondary)">Administrator zweryfikuje zgłoszenie.</p>
            </div>
          </div>

          <button onClick={onClose} className="cursor-pointer p-2 transition hover:bg-(--surface-secondary)">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block font-medium">Powód zgłoszenia</label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`w-full cursor-pointer border bg-(--surface-secondary) px-4 py-3 text-(--foreground) outline-none focus:border-orange-500 ${reasonError ? "border-red-500" : "border-(--border)"} `}
            >
              <option value="">Wybierz powód</option>

              <option value="SCAM">Próba oszustwa</option>

              <option value="FAKE">Fałszywa oferta</option>

              <option value="COPYRIGHT">Naruszenie praw autorskich</option>

              <option value="WRONG_CATEGORY">Nieprawidłowa kategoria</option>

              <option value="OFFENSIVE">Niedozwolona treść</option>

              <option value="OTHER">Inny powód</option>
            </select>

            {reasonError && <p className="mt-2 text-sm text-red-500">{reasonError}</p>}
          </div>

          <div>
            <label className="mb-2 block font-medium">Opis problemu</label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opisz problem..."
              className={`w-full resize-none border bg-(--surface-secondary) p-3 text-(--foreground) outline-none placeholder:text-(--foreground-secondary) focus:border-orange-500 ${descriptionError ? "border-red-500" : "border-(--border)"} `}
            />

            {descriptionError && <p className="mt-2 text-sm text-red-500">{descriptionError}</p>}
          </div>

          <div className="border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-500">
            Zgłoszenie zostanie przeanalizowane przez administratora. Fałszywe zgłoszenia mogą skutkować ograniczeniem konta.
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-(--border) p-5">
          <button
            onClick={onClose}
            className="cursor-pointer border border-(--border) bg-(--surface) px-5 py-3 text-(--foreground) transition hover:bg-(--surface-secondary)"
          >
            Anuluj
          </button>

          <OrangeButton onClick={submit}>Wyślij zgłoszenie</OrangeButton>
        </div>
      </div>
    </div>
  );
};
export default ReportOffer;
