"use client";

import { useState } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { PencilIcon } from "@ovation/icons/PencilIcon";

type EditableTextProps = {
  value: string;
  ariaLabel: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  iconClassName?: string;
};

export const EditableText = ({
  value,
  ariaLabel,
  onSave,
  className,
  placeholder,
  iconClassName,
}: EditableTextProps) => {
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
        placeholder={placeholder}
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
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        "rounded-6 hover:bg-muted/60 -mx-1 inline-flex min-w-0 items-center gap-1.5 px-1 text-left",
        className,
      )}
    >
      <span className="truncate">{value || placeholder}</span>
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
