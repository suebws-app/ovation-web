"use client";

import { PlusIcon } from "@ovation/icons/PlusIcon";

type CoverSlotButtonProps = {
  label: string;
  thumbUrl?: string;
  onClick: () => void;
};

export const CoverSlotButton = ({
  label,
  thumbUrl,
  onClick,
}: CoverSlotButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-8 border-border bg-muted/40 hover:border-foreground/30 relative flex aspect-square items-center justify-center overflow-hidden border transition-colors"
  >
    {thumbUrl ? (
      <img
        src={thumbUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
    ) : (
      <span className="text-muted-foreground flex flex-col items-center gap-1">
        <PlusIcon width={16} height={16} />
        <span className="type-caption">{label}</span>
      </span>
    )}
  </button>
);
