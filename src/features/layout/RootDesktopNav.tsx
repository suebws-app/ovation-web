import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

const linkClassName =
  "text-muted-foreground hover:text-foreground type-body-small rounded-8 px-3 py-2 font-medium transition";

export const RootDesktopNav = () => {
  const t = useTranslations();

  return (
    <nav className="tablet:flex hidden items-center gap-1">
      <Link href={appRoutes.marketing.howItWorks} className={linkClassName}>
        {t("marketing__nav__how_it_works")}
      </Link>
      <Link href={appRoutes.marketing.keepsakes} className={linkClassName}>
        {t("marketing__nav__keepsakes")}
      </Link>
      <Link href={appRoutes.marketing.pricing} className={linkClassName}>
        {t("marketing__nav__pricing")}
      </Link>
      <Link href={appRoutes.marketing.forPlanners} className={linkClassName}>
        {t("marketing__nav__for_planners")}
      </Link>
    </nav>
  );
};
