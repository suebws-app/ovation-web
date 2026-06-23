import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { PageHeading } from "@/components/PageHeading";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const MessagesEmptyState = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card mx-auto mt-12 flex max-w-2xl flex-col items-start gap-4 border p-8">
      <PageHeading kicker={t("messages__empty__eyebrow")}>
        {t("messages__empty__title")}
      </PageHeading>
      <p className="type-body-small text-muted-foreground leading-relaxed">
        {t("messages__empty__body")}
      </p>
      <Button asChild className="rounded-full">
        <Link href={appRoutes.create.root}>{t("messages__empty__cta")}</Link>
      </Button>
    </div>
  );
};
