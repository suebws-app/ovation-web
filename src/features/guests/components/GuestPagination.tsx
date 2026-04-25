"use client";

import { cn } from "@ovation/ui/utils/cn";

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
  return (
    <div className="border-border bg-background flex items-center justify-between border-t px-6 py-3.5">
      <span className="type-caption text-muted-foreground">
        Showing {showing} of {totalItems}
      </span>
      <div className="flex gap-1.5">
        {PAGES.map((page, i) => (
          <PageButton key={`${page}-${i}`} label={page} active={i === 0} />
        ))}
      </div>
    </div>
  );
};

const PageButton = ({ label, active }: { label: string; active: boolean }) => (
  <button
    type="button"
    className={cn(
      "rounded-8 type-caption flex size-7.5 cursor-pointer items-center justify-center font-semibold",
      active
        ? "bg-foreground text-background"
        : "border-border bg-card text-foreground border",
    )}
  >
    {label}
  </button>
);
