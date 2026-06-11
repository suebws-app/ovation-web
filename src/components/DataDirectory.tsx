"use client";

import type { ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";

type DataDirectoryProps = {
  chips: ReactNode;
  title: ReactNode;
  actions: ReactNode;
  tableHead?: ReactNode;
  children: ReactNode;
  pagination?: ReactNode;
  bottomSlot?: ReactNode;
  bodyClassName?: string;
};

export const DataDirectory = ({
  chips,
  title,
  actions,
  tableHead,
  children,
  pagination,
  bottomSlot,
  bodyClassName,
}: DataDirectoryProps) => (
  <div className="flex flex-col gap-4">
    {chips}
    <div className="rounded-16 border-border bg-card flex flex-col overflow-hidden border">
      <div className="border-border tablet:flex-row tablet:items-center tablet:flex-wrap flex flex-col gap-3 border-b px-6 py-4">
        <div className="type-body shrink-0 font-serif font-semibold">
          {title}
        </div>
        <div className="tablet:ml-auto tablet:min-w-0 tablet:flex-1 flex flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      </div>
      <div className="@container/table overflow-x-auto">
        {tableHead}
        <div className={cn("min-h-160", bodyClassName)}>{children}</div>
        {bottomSlot}
      </div>
      {pagination}
    </div>
  </div>
);
