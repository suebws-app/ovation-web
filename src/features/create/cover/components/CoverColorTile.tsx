"use client";

import { cn } from "@ovation/ui/utils/cn";
import { CoverSelectedBadge } from "./CoverSelectedBadge";

type CoverColorTileProps = {
  label: string;
  color: string;
  initials: string;
  selected?: boolean;
  onClick?: () => void;
};

export const CoverColorTile = ({
  label,
  color,
  initials,
  selected = false,
  onClick,
}: CoverColorTileProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    title={label}
    className={cn(
      "rounded-16 relative aspect-square cursor-pointer overflow-hidden",
      selected
        ? "border-primary shadow-primary/25 ring-primary/10 border-[3px] shadow-lg ring-4"
        : "border-border border shadow-sm",
    )}
  >
    <div
      className="flex size-full items-center justify-center opacity-85"
      style={{
        background: `repeating-linear-gradient(135deg, ${color} 0 8px, color-mix(in oklch, ${color}, #000 10%) 8px 16px)`,
      }}
    >
      <span className="type-h3 text-black/40 italic">{initials}</span>
    </div>
    {selected && <CoverSelectedBadge />}
    <span className="type-caption absolute right-2 bottom-2 left-2 font-semibold text-white drop-shadow-sm">
      {label}
    </span>
  </button>
);
