import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { PageHeading } from "@/components/PageHeading";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const DashboardEmpty = () => {
  const t = useTranslations();
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-5">
        <PageHeading kicker={t("dashboard__empty__eyebrow")}>
          {t("dashboard__empty__title")}
        </PageHeading>
        <p className="type-body-small text-muted-foreground max-w-180 leading-relaxed">
          {t("dashboard__empty__body")}
        </p>
        <Button asChild className="shadow-primary/40 rounded-full shadow-md">
          <Link href={appRoutes.create.root}>{t("dashboard__empty__cta")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
