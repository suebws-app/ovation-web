import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { PageHeading } from "@/components/PageHeading";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const GuestsEmptyState = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card mx-auto mt-12 flex max-w-2xl flex-col items-start gap-4 border p-8">
      <PageHeading kicker={t("guests__empty__eyebrow")}>
        {t("guests__empty__title")}
      </PageHeading>
      <p className="type-body-small text-muted-foreground leading-relaxed">
        {t("guests__empty__body")}
      </p>
      <Button asChild className="rounded-full">
        <Link href={appRoutes.create.root}>{t("guests__empty__cta")}</Link>
      </Button>
    </div>
  );
};
