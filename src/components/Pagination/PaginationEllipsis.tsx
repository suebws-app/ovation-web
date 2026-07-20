import { ELLIPSIS } from "@/lib/utils/pagination";

export const PaginationEllipsis = () => (
  <span
    aria-hidden
    className="type-caption text-muted-foreground flex size-9 items-center justify-center"
  >
    {ELLIPSIS}
  </span>
);
