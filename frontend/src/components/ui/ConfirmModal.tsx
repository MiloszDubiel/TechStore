import type { ReactNode } from "react";
import { GrayButton, OrangeButton } from "./Buttons";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Potwierdź",
  cancelText = "Anuluj",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white shadow-xl">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="p-5">
          {typeof message === "string" ? (
            <p className="text-gray-600">{message}</p>
          ) : (
            message
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 p-5">
          <GrayButton onClick={onCancel}>{cancelText}</GrayButton>

          <OrangeButton onClick={onConfirm}> {confirmText}</OrangeButton>
        </div>
      </div>
    </div>
  );
}
