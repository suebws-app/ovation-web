"use client";

import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";

type KioskChecklistItemProps = {
  title: string;
  description: string;
  done: boolean;
  cta?: string;
  onToggle: () => void;
  onCta?: () => void;
};

export const KioskChecklistItem = ({
  title,
  description,
  done,
  cta,
  onToggle,
  onCta,
}: KioskChecklistItemProps) => (
  <div
    className={cn(
      "rounded-16 bg-card flex items-start gap-3 border p-4",
      done ? "border-secondary/40" : "border-border",
    )}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      aria-label={title}
      className={cn(
        "mt-0.5 flex size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
        done
          ? "bg-secondary hover:bg-secondary/85"
          : "border-border bg-card hover:bg-muted border-2",
      )}
    >
      {done && <CheckIcon width={14} height={14} className="text-background" />}
    </button>
    <div className="min-w-0 flex-1">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "type-body-small cursor-pointer text-left font-semibold",
          done && "decoration-foreground/25 line-through",
        )}
      >
        {title}
      </button>
      <div className="type-caption text-muted-foreground mt-0.5 leading-snug">
        {description}
      </div>
      {cta && !done && (
        <Button
          size="sm"
          onClick={onCta}
          className="mt-2.5 rounded-full"
        >
          {cta}
        </Button>
      )}
    </div>
  </div>
);
