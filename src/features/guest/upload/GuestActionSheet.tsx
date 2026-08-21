"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@ovation/ui/components/Sheet";
import { XIcon } from "@ovation/icons/XIcon";
import { cn } from "@ovation/ui/utils/cn";

type GuestActionSheetProps = {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  bodyClassName?: string;
};

export const GuestActionSheet = ({
  open,
  title,
  onOpenChange,
  children,
  bodyClassName,
}: GuestActionSheetProps) => {
  const t = useTranslations();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-24 h-96">
        <SheetClose
          aria-label={t("common__cancel")}
          className="bg-card text-muted-foreground hover:text-foreground ring-border absolute top-4 right-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full ring-1 transition-colors"
        >
          <XIcon width={16} height={16} aria-hidden />
        </SheetClose>

        <div className="mx-auto flex h-full w-full max-w-150 flex-col gap-4 px-5 pt-4 pb-8">
          <SheetTitle className="type-h3 flex h-9 shrink-0 items-center">
            {title}
          </SheetTitle>
          <div
            className={cn("flex min-h-0 flex-1 flex-col gap-4", bodyClassName)}
          >
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
