"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { ThemeToggle } from "@ovation/ui/components/ThemeToggle";
import { cn } from "@ovation/ui/utils/cn";

export const RootHeader = ({ className }: { className?: string }) => {
  const t = useTranslations();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-19 items-center justify-between px-6 lg:px-20">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link
            href="/how-it-works"
            className="font-medium hover:text-foreground"
          >
            {t("marketing__nav__how_it_works")}
          </Link>
          <Link href="/keepsakes" className="font-medium hover:text-foreground">
            {t("marketing__nav__keepsakes")}
          </Link>
          <Link href="/pricing" className="font-medium hover:text-foreground">
            {t("marketing__nav__pricing")}
          </Link>
          <Link href="/stories" className="font-medium hover:text-foreground">
            {t("marketing__nav__stories")}
          </Link>
          <Link
            href="/for-planners"
            className="font-medium hover:text-foreground"
          >
            {t("marketing__nav__for_planners")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-foreground md:block"
          >
            {t("marketing__nav__sign_in")}
          </Link>
          <Button size="sm" className="gap-1.5">
            {t("marketing__nav__cta")}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
