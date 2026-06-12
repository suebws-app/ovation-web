import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const DashboardPlaceholderCTA = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card flex flex-col items-start gap-5 border p-8">
      <Kicker className="text-primary">
        {t("dashboard__placeholder__eyebrow")}
      </Kicker>
      <h1 className="type-h1 leading-tight font-semibold tracking-tight">
        {t("dashboard__placeholder__title")}
      </h1>
      <p className="type-body-small text-muted-foreground max-w-180 leading-relaxed">
        {t("dashboard__placeholder__body")}
      </p>
      <Button
        asChild
        size="lg"
        className="shadow-primary/40 rounded-full shadow-md"
      >
        <Link href={appRoutes.create.root}>{t("dashboard__empty__cta")}</Link>
      </Button>
    </div>
  );
};
