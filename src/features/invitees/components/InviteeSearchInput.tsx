"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchIcon } from "@ovation/icons/SearchIcon";
import { XIcon } from "@ovation/icons/XIcon";

type InviteeSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const InviteeSearchInput = ({
  value,
  onChange,
}: InviteeSearchInputProps) => {
  const t = useTranslations();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (draft === value) return;
    const id = window.setTimeout(() => {
      onChange(draft);
    }, 300);
    return () => window.clearTimeout(id);
  }, [draft, value, onChange]);

  return (
    <div className="rounded-10 border-border bg-background flex w-64 items-center gap-2.5 border px-3.5 py-2">
      <SearchIcon
        width={14}
        height={14}
        className="text-muted-foreground"
        strokeWidth={1.7}
      />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={t("invitees__directory__search_placeholder")}
        className="type-caption text-foreground placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
      />
      {draft.length > 0 && (
        <button
          type="button"
          onClick={() => setDraft("")}
          aria-label={t("invitees__directory__search_clear")}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <XIcon width={11} height={11} strokeWidth={1.7} />
        </button>
      )}
    </div>
  );
};
