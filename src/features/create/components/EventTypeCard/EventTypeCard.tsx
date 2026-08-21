"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import type { EventType } from "@/lib/event-types";

type EventTypeCardProps = {
  type: EventType;
  selected: boolean;
  onSelect: (type: EventType) => void;
};

export const EventTypeCard = ({
  type,
  selected,
  onSelect,
}: EventTypeCardProps) => {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      aria-pressed={selected}
      className={cn(
        "rounded-12 flex flex-col items-start gap-1 border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
      )}
    >
      <span className="type-body text-foreground font-medium">
        {t(`et__${type}__name`)}
      </span>
      <span className="type-caption text-muted-foreground">
        {t(`et__${type}__tagline`)}
      </span>
    </button>
  );
};
