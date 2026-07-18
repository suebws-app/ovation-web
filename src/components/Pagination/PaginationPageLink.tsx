import type { ComponentProps } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { Link } from "@/i18n/navigation";

type PaginationPageLinkProps = {
  page: number;
  active: boolean;
  href: ComponentProps<typeof Link>["href"];
};

export const PaginationPageLink = ({
  page,
  active,
  href,
}: PaginationPageLinkProps) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    aria-label={`Page ${page}`}
    className={cn(
      "rounded-8 type-body-small flex size-9 items-center justify-center font-semibold transition",
      active
        ? "bg-foreground text-background"
        : "border-border bg-card text-foreground hover:border-primary border",
    )}
  >
    {page}
  </Link>
);
