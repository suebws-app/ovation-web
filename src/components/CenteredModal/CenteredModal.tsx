"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { XIcon } from "@ovation/icons/XIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@ovation/ui/components/Sheet";

type CenteredModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export const CenteredModal = ({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  contentClassName,
}: CenteredModalProps) => {
  const t = useTranslations();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="center"
        className={cn("p-6", contentClassName ?? "h-115")}
      >
        <SheetHeader className="shrink-0 flex-row items-start justify-between gap-3 p-0">
          <div className="flex flex-col gap-2">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </div>
          <SheetClose
            aria-label={t("common__close")}
            className="hover:bg-muted text-muted-foreground hover:text-foreground -m-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <XIcon className="size-4" />
          </SheetClose>
        </SheetHeader>
        <div className="-mx-6 flex min-h-0 flex-1 flex-col overflow-y-auto px-6">
          {children}
        </div>
        {footer && (
          <SheetFooter className="border-border -mx-6 -mb-6 shrink-0 border-t p-4">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
