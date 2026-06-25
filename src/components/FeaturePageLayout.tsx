"use client";

import type { ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { containerClassName } from "@/lib/utils/layoutClassNames";

type FeaturePageLayoutProps = {
  children: ReactNode;
  detailPane?: ReactNode;
  detailPaneOpen?: boolean;
  batchFooter?: ReactNode;
  overlay?: ReactNode;
  contentClassName?: string;
};

export const FeaturePageLayout = ({
  children,
  detailPane,
  detailPaneOpen = false,
  batchFooter,
  overlay,
  contentClassName,
}: FeaturePageLayoutProps) => (
  <div className="flex w-full flex-1">
    <div className="relative flex w-full min-w-0 flex-1 flex-col">
      <div className={cn(containerClassName, contentClassName)}>{children}</div>
      {batchFooter}
      {overlay}
    </div>
    {detailPane ? (
      <div
        className={cn(
          "small-desktop:block hidden overflow-hidden transition-[width] duration-300 ease-out",
          detailPaneOpen ? "w-105" : "w-0",
        )}
      >
        <div className="w-105">{detailPane}</div>
      </div>
    ) : null}
  </div>
);
