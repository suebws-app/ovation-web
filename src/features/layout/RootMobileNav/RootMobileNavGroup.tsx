"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import { cn } from "@ovation/ui/utils/cn";

type RootMobileNavGroupProps = {
  label: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export const RootMobileNavGroup = ({
  label,
  defaultOpen = false,
  children,
}: RootMobileNavGroupProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="text-foreground type-body-large rounded-12 hover:bg-muted flex cursor-pointer items-center justify-between gap-2 px-3 py-3.5 text-left font-medium transition"
      >
        {label}
        <ChevronDownIcon
          className={cn("size-4 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && <div className="flex flex-col pb-1">{children}</div>}
    </div>
  );
};
