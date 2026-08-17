import { useTranslations } from "next-intl";
import { appRoutes } from "@/lib/routes";
import { RootNavLink } from "./RootNavLink";
import { UseCasesMenu } from "./UseCasesMenu";

export const RootNavLinks = () => {
  const t = useTranslations();

  return (
    <nav className="tablet:flex hidden items-center gap-7">
      <UseCasesMenu />
      <RootNavLink href={appRoutes.marketing.pricing}>
        {t("marketing__nav__pricing")}
      </RootNavLink>
      <RootNavLink href={appRoutes.marketing.blog}>
        {t("marketing__nav__blog")}
      </RootNavLink>
    </nav>
  );
};
