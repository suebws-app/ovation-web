"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@ovation/ui/components/DropdownMenu";
import { USE_CASES_MENU_ITEMS } from "./navItems";
import { UseCasesMenuItem } from "./UseCasesMenuItem";

const CLOSE_DELAY_MS = 150;

export const UseCasesMenu = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (!closeTimer.current) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openNow = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  // The menu is offset from the trigger, so the pointer briefly crosses a gap
  // that belongs to neither. Closing on a delay lets it survive that crossing.
  const closeAfterDelay = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => clearCloseTimer, []);

  return (
    <div onMouseEnter={openNow} onMouseLeave={closeAfterDelay}>
      <DropdownMenu
        open={isOpen}
        onOpenChange={(next) => {
          clearCloseTimer();
          setIsOpen(next);
        }}
        modal={false}
      >
        <DropdownMenuTrigger className="text-foreground type-body hover:text-primary group flex cursor-pointer items-center gap-1 font-medium transition focus-visible:outline-none">
          {t("marketing__nav__use_cases")}
          <ChevronDownIcon className="size-4 transition group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className="rounded-16 w-88 p-2"
          onCloseAutoFocus={(event) => event.preventDefault()}
          onMouseEnter={openNow}
          onMouseLeave={closeAfterDelay}
        >
          {USE_CASES_MENU_ITEMS.map((item) => (
            <UseCasesMenuItem
              key={item.key}
              href={item.href}
              Icon={item.Icon}
              label={t(item.labelKey)}
              description={t(item.descriptionKey)}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
