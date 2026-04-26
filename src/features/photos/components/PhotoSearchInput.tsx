"use client";

import { useTranslations } from "next-intl";
import { Search } from "@ovation/icons/Search";

export const PhotoSearchInput = () => {
  const t = useTranslations();
  return (
    <div className="rounded-10 border-border bg-background flex flex-1 items-center gap-2.5 border px-3.5 py-2.5">
      <Search
        width={15}
        height={15}
        className="text-muted-foreground"
        strokeWidth={1.7}
      />
      <input
        placeholder={t("photos__toolbar__search_placeholder")}
        className="type-body-small text-foreground placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
      />
      <kbd className="rounded-4 border-border bg-card type-caption text-muted-foreground border px-1.5 py-0.5">
        ⌘K
      </kbd>
    </div>
  );
};
