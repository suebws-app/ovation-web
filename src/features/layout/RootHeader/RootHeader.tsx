import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { cn } from "@ovation/ui/utils/cn";
import { RootMobileNav } from "../RootMobileNav";
import { LanguageSelect } from "@/components/LanguageSelect";
import { RootNavLinks } from "./RootNavLinks";

type RootHeaderProps = {
  className?: string;
  sticky?: boolean;
};

export const RootHeader = ({ className, sticky = true }: RootHeaderProps) => {
  const t = useTranslations();

  return (
    <header
      className={cn(
        "border-border bg-background border-b",
        sticky && "sticky top-0 z-50",
        className,
      )}
    >
      <div className="mx-auto flex h-19 w-full max-w-332 items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href={appRoutes.home}>
            <Logo />
          </Link>
          <RootNavLinks />
        </div>

        <div className="flex items-center gap-5">
          <span className="tablet:flex hidden">
            <LanguageSelect />
          </span>

          <Link
            href={appRoutes.auth.signIn}
            className="text-foreground type-body hover:text-primary tablet:block hidden font-medium transition"
          >
            {t("marketing__nav__sign_in")}
          </Link>

          <Button
            variant="pillPrimary"
            size="lg"
            asChild
            className="tablet:flex hidden h-11"
          >
            <Link href={appRoutes.auth.role}>
              {t("marketing__nav__get_started")}
            </Link>
          </Button>

          <RootMobileNav languageSelect={<LanguageSelect />} />
        </div>
      </div>
    </header>
  );
};
