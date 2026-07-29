"use client";

import { useState } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { PencilIcon } from "@ovation/icons/PencilIcon";

type InlineEditTextProps = {
  value: string;
  ariaLabel: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  containerClassName?: string;
  iconClassName?: string;
};

export const InlineEditText = ({
  value,
  ariaLabel,
  onSave,
  className,
  inputClassName,
  containerClassName,
  iconClassName,
}: InlineEditTextProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        aria-label={ariaLabel}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
          if (event.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={cn(
          "border-border rounded-8 bg-card border px-2 py-0.5 outline-none",
          inputClassName,
        )}
      />
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", containerClassName)}
    >
      <span className={className}>{value}</span>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={cn(
          "text-muted-foreground hover:text-foreground shrink-0 transition",
          iconClassName,
        )}
      >
        <PencilIcon width={14} height={14} />
      </button>
    </span>
  );
};
