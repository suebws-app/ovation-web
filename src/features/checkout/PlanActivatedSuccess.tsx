import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { PendingEventCreator } from "./PendingEventCreator";

type PlanActivatedSuccessProps = {
  orderId: string;
  planCode: string;
};

const DRE_PLAN_CODE = "storage_extension";

export const PlanActivatedSuccess = async ({
  orderId,
  planCode,
}: PlanActivatedSuccessProps) => {
  const t = await getTranslations();
  const isDre = planCode === DRE_PLAN_CODE;

  return (
    <>
      {!isDre && <PendingEventCreator orderId={orderId} />}
      <>
        <div className="rounded-20 bg-card border-border flex flex-col items-center gap-3 border p-8 text-center">
          <div className="rounded-16 bg-primary/15 inline-flex size-16 items-center justify-center">
            <CheckIcon
              width={28}
              height={28}
              className="text-primary"
              strokeWidth={2.5}
            />
          </div>
          <Kicker className="text-primary mt-2">
            {isDre ? t("dre_activated__eyebrow") : t("plan_activated__eyebrow")}
          </Kicker>
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {isDre ? t("dre_activated__title") : t("plan_activated__title")}
          </h1>
          <p className="type-body-small text-muted-foreground max-w-md leading-relaxed">
            {isDre ? t("dre_activated__body") : t("plan_activated__body")}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link href={appRoutes.app.root}>
              {isDre
                ? t("dre_activated__back_dashboard")
                : t("plan_activated__back_dashboard")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link
              href={isDre ? appRoutes.settings.billing : appRoutes.app.qrCode}
            >
              {isDre
                ? t("dre_activated__manage_billing")
                : t("plan_activated__view_qr")}
            </Link>
          </Button>
        </div>
      </>
    </>
  );
};
