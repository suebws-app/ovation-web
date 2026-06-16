"use client";

import { useEffect } from "react";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { InfoIcon } from "@ovation/icons/InfoIcon";
import { cn } from "@ovation/ui/utils/cn";
import { useDismissToast, useToasts, type ToastItem } from "./toastStore";

const KIND_STYLES: Record<
  ToastItem["kind"],
  { icon: React.ReactNode; classes: string }
> = {
  success: {
    icon: <CheckIcon width={16} height={16} strokeWidth={2.5} />,
    classes: "bg-secondary/85 text-secondary-foreground",
  },
  error: {
    icon: <XIcon width={16} height={16} strokeWidth={2.5} />,
    classes: "bg-destructive/85 text-primary-foreground",
  },
  info: {
    icon: <InfoIcon width={16} height={16} strokeWidth={2} />,
    classes: "bg-foreground/85 text-background",
  },
};

const ToastRow = ({ toast }: { toast: ToastItem }) => {
  const dismiss = useDismissToast();
  useEffect(() => {
    const handle = window.setTimeout(() => dismiss(toast.id), toast.durationMs);
    return () => window.clearTimeout(handle);
  }, [toast.id, toast.durationMs, dismiss]);

  const style = KIND_STYLES[toast.kind];

  return (
    <div
      role="status"
      className={cn(
        "rounded-12 type-body-small animate-slide-down flex max-w-sm items-center gap-3 px-4 py-3 shadow-lg backdrop-blur-md",
        style.classes,
      )}
    >
      <span className="bg-background/15 inline-flex size-7 shrink-0 items-center justify-center rounded-full">
        {style.icon}
      </span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        className="hover:bg-background/15 -mr-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
        aria-label="Dismiss"
      >
        <XIcon width={14} height={14} strokeWidth={2} />
      </button>
    </div>
  );
};

export const Toaster = () => {
  const toasts = useToasts();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <div className="pointer-events-auto flex w-full max-w-sm flex-col items-stretch gap-2">
        {toasts.map((t) => (
          <ToastRow key={t.id} toast={t} />
        ))}
      </div>
    </div>
  );
};
