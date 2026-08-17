"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@ovation/ui/components/DropdownMenu";
import { USE_CASES_MENU_ITEMS } from "./navItems";
import { UseCasesMenuItem } from "./UseCasesMenuItem";

export const UseCasesMenu = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger className="text-foreground type-body hover:text-primary group flex cursor-pointer items-center gap-1 font-medium transition focus-visible:outline-none">
          {t("marketing__nav__use_cases")}
          <ChevronDownIcon className="size-4 transition group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className="rounded-16 w-88 p-2"
          onCloseAutoFocus={(event) => event.preventDefault()}
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
