"use client";

import { useTranslations } from "next-intl";
import { Sort } from "@ovation/icons/Sort";

export const PhotoSortButton = () => {
  const t = useTranslations();
  return (
    <button
      type="button"
      className="rounded-10 border-border bg-card type-body-small text-muted-foreground hover:bg-muted desktop:inline-flex hidden cursor-pointer items-center gap-1.5 border px-3.5 py-2.5 font-medium transition-colors"
    >
      <Sort width={13} height={13} strokeWidth={1.7} />
      {t("photos__toolbar__sort_by_reception")}
    </button>
  );
};
