"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchIcon } from "@ovation/icons/SearchIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { useGuestSearch, useGuestsStore } from "../store/useGuestsStore";

export const GuestSearchInput = () => {
  const t = useTranslations();
  const search = useGuestSearch();
  const setSearch = useGuestsStore((s) => s.setSearch);
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    if (draft === search) return;
    const id = window.setTimeout(() => {
      setSearch(draft);
    }, 300);
    return () => window.clearTimeout(id);
  }, [draft, search, setSearch]);

  return (
    <div className="border-border bg-background focus-within:ring-ring flex h-10 w-64 items-center gap-2 rounded-lg border px-3 focus-within:ring-2 focus-within:outline-none">
      <SearchIcon
        width={14}
        height={14}
        className="text-muted-foreground"
        strokeWidth={1.7}
      />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={t("guests__directory__search_placeholder")}
        className="text-foreground placeholder:text-muted-foreground tablet:text-sm flex-1 bg-transparent text-base outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      {draft.length > 0 && (
        <button
          type="button"
          onClick={() => setDraft("")}
          aria-label={t("guests__directory__search_clear")}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <XIcon width={11} height={11} strokeWidth={1.7} />
        </button>
      )}
    </div>
  );
};
