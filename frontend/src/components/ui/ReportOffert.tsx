import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { OrangeButton } from "./Buttons";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    reason: string;
    description: string;
    product_id: string;
  }) => void;
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
    <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-gray-300 shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className=" p-2 text-red-600 bg-red-100">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">Zgłoś ofertę</h2>

              <p className="text-sm text-gray-500">
                Administrator zweryfikuje zgłoszenie.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block mb-2 font-medium">Powód zgłoszenia</label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`focus:border-orange-500 w-full px-4 py-3 border  ${
                reasonError ? "border-red-500" : "border-gray-300"
              } outline-none cursor-pointer`}
            >
              <option value="">Wybierz powód</option>
              <option value="SCAM">Próba oszustwa</option>
              <option value="FAKE">Fałszywa oferta</option>
              <option value="COPYRIGHT">Naruszenie praw autorskich</option>
              <option value="WRONG_CATEGORY">Nieprawidłowa kategoria</option>
              <option value="OFFENSIVE">Niedozwolona treść</option>
              <option value="OTHER">Inny powód</option>
            </select>
            {reasonError && (
              <p className="mt-2 text-sm text-red-600">{reasonError}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Opis problemu</label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opisz problem..."
              className={`
                        w-full
                        p-3
                        border
                        outline-none
                        resize-none
                        focus:border-orange-500
                        ${
                          descriptionError
                            ? "border-red-500"
                            : "border-gray-300"
                        }
  `}
            />
            {descriptionError && (
              <p className="mt-2 text-sm text-red-600">{descriptionError}</p>
            )}
          </div>

          <div className="bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-300">
            Zgłoszenie zostanie przeanalizowane przez administratora. Fałszywe
            zgłoszenia mogą skutkować ograniczeniem konta.
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-300">
          <button
            onClick={onClose}
            className="hover:bg-gray-100 px-5 py-3 border border-gray-300 cursor-pointer"
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
