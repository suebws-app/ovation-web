"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MenuIcon } from "@ovation/icons/MenuIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { Logo } from "@ovation/ui/components/Logo";
import { Button } from "@ovation/ui/components/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  VisuallyHidden,
} from "@ovation/ui/components/Sheet";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { USE_CASES_MENU_ITEMS } from "../RootHeader/navItems";
import { RootMobileNavLink } from "./RootMobileNavLink";

type RootMobileNavProps = {
  languageSelect: ReactNode;
};

export const RootMobileNav = ({ languageSelect }: RootMobileNavProps) => {
  const t = useTranslations();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label={t("nav__open_menu")}
          className="text-foreground hover:bg-muted tablet:hidden flex size-9 items-center justify-center rounded-full transition"
        >
          <MenuIcon className="size-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col gap-0 p-0">
        <VisuallyHidden.Root>
          <SheetTitle>{t("marketing__nav__use_cases")}</SheetTitle>
        </VisuallyHidden.Root>

        <div className="border-border flex h-19 shrink-0 items-center justify-between border-b px-6">
          <SheetClose asChild>
            <Link href={appRoutes.home}>
              <Logo />
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <button
              aria-label={t("nav__close_menu")}
              className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-full transition"
            >
              <XIcon className="size-5" />
            </button>
          </SheetClose>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          <p className="text-muted-foreground landing-eyebrow px-3 pt-2 pb-1">
            {t("marketing__nav__use_cases")}
          </p>
          {USE_CASES_MENU_ITEMS.map((item) => (
            <RootMobileNavLink key={item.key} href={item.href} nested>
              {t(item.labelKey)}
            </RootMobileNavLink>
          ))}

          <RootMobileNavLink href={appRoutes.marketing.pricing}>
            {t("marketing__nav__pricing")}
          </RootMobileNavLink>
          <RootMobileNavLink href={appRoutes.marketing.blog}>
            {t("marketing__nav__blog")}
          </RootMobileNavLink>
          <RootMobileNavLink href={appRoutes.marketing.howItWorks}>
            {t("marketing__nav__how_it_works")}
          </RootMobileNavLink>
          <RootMobileNavLink href={appRoutes.marketing.keepsakes}>
            {t("marketing__nav__keepsakes")}
          </RootMobileNavLink>
        </nav>

        <div className="border-border shrink-0 border-t px-6 py-6">
          <div className="mb-5 flex items-center gap-4">
            {languageSelect}
            <ThemeToggle />
          </div>
          <SheetClose asChild>
            <Button asChild variant="pillPrimary" className="mb-3 h-12 w-full">
              <Link href={appRoutes.auth.role}>
                {t("marketing__nav__get_started")}
              </Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild className="h-12 w-full" variant="outline">
              <Link href={appRoutes.auth.signIn}>
                {t("marketing__nav__sign_in")}
              </Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
