"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type ProUpgradeAlertProps = {
  planTier: string | null;
};

export const ProUpgradeAlert = ({ planTier }: ProUpgradeAlertProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  if (pathname.startsWith(appRoutes.app.plans)) return null;

  const isFree = !planTier || planTier === "free";
  if (!isFree) return null;

  return (
    <div className="max-w-container mx-auto w-full px-6 pt-2">
      <div className="rounded-16 border-primary/40 bg-primary/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
        <div className="rounded-12 bg-primary text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-bold">
          ✦
        </div>
        <div className="flex-1">
          <p className="type-overline text-primary tracking-[2px]">
            {t("app__pro__upgrade_alert__eyebrow")}
          </p>
          <p className="type-body-large mt-1 font-serif font-semibold">
            {t("app__pro__upgrade_alert__title")}
          </p>
          <p className="type-body-small text-muted-foreground">
            {t("app__pro__upgrade_alert__description")}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="tablet:w-auto w-full rounded-full bg-transparent"
        >
          <Link href={`${appRoutes.auth.plans}?as=pro`}>
            {t("app__pro__upgrade_alert__cta")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
