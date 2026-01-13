"use client";

import { useTranslations } from "next-intl";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "default",
}: ConfirmDialogProps) {
  const t = useTranslations();

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-lg border bg-card p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-start gap-4">
            <div
              className={`flex-shrink-0 rounded-full p-2 ${
                variant === "danger"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("common.close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {cancelText || t("common.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                variant === "danger"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {confirmText || t("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
