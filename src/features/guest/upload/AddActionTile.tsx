"use client";

import type { ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";

type AddActionTileProps = {
  icon: ReactNode;
  title: string;
  hint: string;
  tone: "voice" | "text";
  onClick: () => void;
};

const TONE_ICON = {
  voice: "bg-primary/15 text-primary",
  text: "bg-accent/50 text-foreground",
} as const;

export const AddActionTile = ({
  icon,
  title,
  hint,
  tone,
  onClick,
}: AddActionTileProps) => (
  <button
    type="button"
    onClick={onClick}
    className="border-primary/40 rounded-16 hover:bg-primary/5 flex flex-1 cursor-pointer flex-col items-center gap-2 border-2 border-dashed p-4 text-center transition-colors"
  >
    <span
      className={cn(
        "flex size-10 items-center justify-center rounded-full",
        TONE_ICON[tone],
      )}
    >
      {icon}
    </span>
    <span className="type-body-small text-foreground font-semibold">
      {title}
    </span>
    <span className="type-caption text-muted-foreground leading-tight">
      {hint}
    </span>
  </button>
);
