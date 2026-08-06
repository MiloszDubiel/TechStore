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
    <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="
      w-full max-w-md
      border border-(--border)
      bg-(--surface)
      text-(--foreground)
      shadow-xl
    "
      >
        <div className="border-b border-(--border) p-5">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="p-5">
          {typeof message === "string" ? (
            <p className="text-(--foreground-secondary)">{message}</p>
          ) : (
            message
          )}
        </div>

        <div className="flex justify-end gap-3border-t border-(--border) p-5">
          <GrayButton onClick={onCancel}>{cancelText}</GrayButton>

          <OrangeButton onClick={onConfirm}>{confirmText}</OrangeButton>
        </div>
      </div>
    </div>
  );
}
