"use client";

import { ChevronLeftIcon } from "@ovation/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@ovation/icons/ChevronRightIcon";
import { buildPages } from "@/lib/utils/pagination";
import { DataPageButton } from "./DataPageButton";

type DataPaginationLabels = {
  showing: string;
  prev: string;
  next: string;
  pageOf: string;
};

type DataPaginationProps = {
  current: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels: DataPaginationLabels;
};

export const DataPagination = ({
  current,
  totalPages,
  onPageChange,
  labels,
}: DataPaginationProps) => {
  const safeTotalPages = Math.max(totalPages, 1);
  const pages = buildPages(current, safeTotalPages);
  const canPrev = current > 1;
  const canNext = current < safeTotalPages;

  return (
    <div className="border-border bg-background tablet:flex-row tablet:items-center flex flex-col gap-3 border-t px-6 py-3.5">
      <span className="type-caption text-muted-foreground">
        {labels.showing}
      </span>
      <div className="tablet:ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => canPrev && onPageChange(current - 1)}
          disabled={!canPrev}
          aria-label={labels.prev}
          className="border-border bg-card text-foreground rounded-8 flex size-7.5 items-center justify-center border not-disabled:cursor-pointer disabled:opacity-40"
        >
          <ChevronLeftIcon width={14} height={14} />
        </button>
        {pages.map((page, i) => (
          <DataPageButton
            key={`${page}-${i}`}
            label={String(page)}
            active={page === current}
            disabled={page === "…"}
            onClick={() =>
              typeof page === "number" ? onPageChange(page) : undefined
            }
          />
        ))}
        <button
          type="button"
          onClick={() => canNext && onPageChange(current + 1)}
          disabled={!canNext}
          aria-label={labels.next}
          className="border-border bg-card text-foreground rounded-8 flex size-7.5 items-center justify-center border not-disabled:cursor-pointer disabled:opacity-40"
        >
          <ChevronRightIcon width={14} height={14} />
        </button>
        <span className="type-caption text-muted-foreground ml-2">
          {labels.pageOf}
        </span>
      </div>
    </div>
  );
};
