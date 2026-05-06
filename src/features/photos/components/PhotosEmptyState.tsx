import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const PhotosEmptyState = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card mx-auto mt-12 flex max-w-2xl flex-col items-start gap-4 border p-8">
      <Eyebrow className="text-primary">{t("photos__empty__eyebrow")}</Eyebrow>
      <h1 className="type-h1 font-serif leading-tight font-semibold tracking-tight">
        {t("photos__empty__title")}
      </h1>
      <p className="type-body-small text-muted-foreground leading-relaxed">
        {t("photos__empty__body")}
      </p>
      <Button asChild className="rounded-full">
        <Link href={appRoutes.auth.signUpStep(3)}>
          {t("photos__empty__cta")}
        </Link>
      </Button>
    </div>
  );
};
