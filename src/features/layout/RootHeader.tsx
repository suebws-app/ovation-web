import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { cn } from "@ovation/ui/utils/cn";
import { RootMobileNav } from "./RootMobileNav";
import { LanguageSelect } from "@/components/LanguageSelect";

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
        <Link href={appRoutes.home}>
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <span className="tablet:flex hidden">
            <LanguageSelect />
          </span>

          <Button size="sm" asChild className="tablet:flex hidden gap-1.5">
            <Link href={appRoutes.auth.signIn}>
              {t("marketing__nav__sign_in")}
            </Link>
          </Button>
          <RootMobileNav languageSelect={<LanguageSelect />} />
        </div>
      </div>
    </header>
  );
};
