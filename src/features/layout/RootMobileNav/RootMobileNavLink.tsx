"use client";

import { type ReactNode } from "react";
import { SheetClose } from "@ovation/ui/components/Sheet";
import { Link } from "@/i18n/navigation";
import { cn } from "@ovation/ui/utils/cn";

type RootMobileNavLinkProps = {
  href: string;
  nested?: boolean;
  children: ReactNode;
};

export const RootMobileNavLink = ({
  href,
  nested = false,
  children,
}: RootMobileNavLinkProps) => (
  <SheetClose asChild>
    <Link
      href={href}
      className={cn(
        "text-foreground rounded-12 hover:bg-muted px-3 py-3.5 font-medium transition",
        nested
          ? "type-body text-muted-foreground pl-7"
          : "type-body-large text-foreground",
      )}
    >
      {children}
    </Link>
  </SheetClose>
);
