import type { ComponentProps } from "react";
import { ChevronLeftIcon } from "@ovation/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@ovation/icons/ChevronRightIcon";
import { Link } from "@/i18n/navigation";
import { buildPages, ELLIPSIS } from "@/lib/utils/pagination";
import { PaginationEllipsis } from "./PaginationEllipsis";
import { PaginationPageLink } from "./PaginationPageLink";

type LinkHref = ComponentProps<typeof Link>["href"];

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => LinkHref;
  labels: { prev: string; next: string };
  className?: string;
};

const arrowClasses =
  "border-border bg-card text-foreground rounded-8 flex size-9 items-center justify-center border transition hover:border-primary";
const disabledArrowClasses =
  "border-border bg-card text-muted-foreground rounded-8 flex size-9 items-center justify-center border opacity-40";

export const Pagination = ({
  currentPage,
  totalPages,
  buildHref,
  labels,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 ${className ?? ""}`.trim()}
    >
      {canPrev ? (
        <Link
          href={buildHref(currentPage - 1)}
          aria-label={labels.prev}
          className={arrowClasses}
        >
          <ChevronLeftIcon width={14} height={14} />
        </Link>
      ) : (
        <span aria-hidden className={disabledArrowClasses}>
          <ChevronLeftIcon width={14} height={14} />
        </span>
      )}

      {pages.map((page, index) =>
        page === ELLIPSIS ? (
          <PaginationEllipsis key={`ellipsis-${index}`} />
        ) : (
          <PaginationPageLink
            key={page}
            page={page}
            active={page === currentPage}
            href={buildHref(page)}
          />
        ),
      )}

      {canNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          aria-label={labels.next}
          className={arrowClasses}
        >
          <ChevronRightIcon width={14} height={14} />
        </Link>
      ) : (
        <span aria-hidden className={disabledArrowClasses}>
          <ChevronRightIcon width={14} height={14} />
        </span>
      )}
    </nav>
  );
};
