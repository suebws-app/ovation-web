"use client";

import { useState } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { PencilIcon } from "@ovation/icons/PencilIcon";
import { money } from "../utils";

type EditableAmountProps = {
  value: number;
  ariaLabel: string;
  onSave: (value: number) => void;
  className?: string;
  iconClassName?: string;
};

export const EditableAmount = ({
  value,
  ariaLabel,
  onSave,
  className,
  iconClassName,
}: EditableAmountProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    setEditing(false);
    const parsed = Math.round(Number(draft));
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed !== value) {
      onSave(parsed);
    } else {
      setDraft(String(value));
    }
  };

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        min={0}
        value={draft}
        aria-label={ariaLabel}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
          if (event.key === "Escape") {
            setDraft(String(value));
            setEditing(false);
          }
        }}
        className={cn(
          "border-border rounded-8 bg-card w-full border px-2 py-0.5 outline-none",
          className,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(String(value));
        setEditing(true);
      }}
      className={cn(
        "rounded-6 hover:bg-muted/60 -mx-1 inline-flex items-center gap-1.5 px-1 text-left",
        className,
      )}
    >
      <span>{money(value)}</span>
      {iconClassName !== undefined ? (
        <PencilIcon
          width={12}
          height={12}
          className={cn("text-muted-foreground shrink-0", iconClassName)}
        />
      ) : null}
    </button>
  );
};
