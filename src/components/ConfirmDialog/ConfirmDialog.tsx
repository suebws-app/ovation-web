"use client";

import { useEffect } from "react";
import { Button } from "@ovation/ui/components/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmTone?: "primary" | "destructive";
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  isPending = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, isPending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="bg-foreground/60 fixed inset-0 z-70 flex items-center justify-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={() => {
        if (!isPending) onCancel();
      }}
    >
      <div
        className="rounded-20 bg-card mx-4 flex w-full max-w-sm flex-col gap-3 p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="type-h3 text-left font-semibold tracking-tight"
        >
          {title}
        </h2>
        {description && (
          <p className="type-body-small text-muted-foreground text-center">
            {description}
          </p>
        )}
        <div className="mt-3 flex w-full gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 rounded-full"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-full"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
