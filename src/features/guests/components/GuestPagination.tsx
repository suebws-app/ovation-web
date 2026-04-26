"use client";

import { useTranslations } from "next-intl";
import { GuestPageButton } from "./GuestPageButton";

type GuestPaginationProps = {
  current: number;
  total: number;
  showing: number;
  of: number;
};

const PAGES = ["1", "2", "3", "\u2026", "12"];

export const GuestPagination = ({
  showing,
  of: totalItems,
}: GuestPaginationProps) => {
  const t = useTranslations();
  return (
    <div className="border-border bg-background flex items-center justify-between border-t px-6 py-3.5">
      <span className="type-caption text-muted-foreground">
        {t("guests__pagination__showing", {
          showing,
          total: totalItems,
        })}
      </span>
      <div className="flex gap-1.5">
        {PAGES.map((page, i) => (
          <GuestPageButton key={`${page}-${i}`} label={page} active={i === 0} />
        ))}
      </div>
    </div>
  );
};
