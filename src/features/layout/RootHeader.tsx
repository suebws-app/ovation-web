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
        "border-border bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-19 items-center justify-between px-6 lg:px-20">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="text-muted-foreground hidden items-center gap-8 text-sm md:flex">
          <Link
            href="/how-it-works"
            className="hover:text-foreground font-medium"
          >
            {t("marketing__nav__how_it_works")}
          </Link>
          <Link href="/keepsakes" className="hover:text-foreground font-medium">
            {t("marketing__nav__keepsakes")}
          </Link>
          <Link href="/pricing" className="hover:text-foreground font-medium">
            {t("marketing__nav__pricing")}
          </Link>
          <Link href="/stories" className="hover:text-foreground font-medium">
            {t("marketing__nav__stories")}
          </Link>
          <Link
            href="/for-planners"
            className="hover:text-foreground font-medium"
          >
            {t("marketing__nav__for_planners")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="text-foreground hidden text-sm font-medium md:block"
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
