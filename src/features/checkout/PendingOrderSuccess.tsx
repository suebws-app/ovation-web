import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { LogoHeader } from "@/components/LogoHeader";

type PendingOrderSuccessProps = {
  orderId: string;
};

export const PendingOrderSuccess = async ({
  orderId,
}: PendingOrderSuccessProps) => {
  const t = await getTranslations();
  return (
    <div className="bg-background min-h-screen">
      <LogoHeader />
      <main className="mx-auto flex w-full max-w-160 flex-col gap-6 px-6 py-10">
        <div className="rounded-20 bg-card border-border flex flex-col items-center gap-3 border p-8 text-center">
          <div className="rounded-16 bg-secondary/15 inline-flex size-16 items-center justify-center">
            <CheckIcon
              width={28}
              height={28}
              className="text-secondary"
              strokeWidth={2.5}
            />
          </div>
          <Kicker className="text-secondary mt-2">
            {t("checkout__success__eyebrow")}
          </Kicker>
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {t("checkout__success__title")}
          </h1>
          <p className="type-body-small text-muted-foreground max-w-md leading-relaxed">
            {t("checkout__success__pending_body")}
          </p>
          <p className="type-caption text-muted-foreground mt-2 font-mono">
            #{orderId.slice(0, 8)}
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link href={appRoutes.app.orders}>
              {t("checkout__success__view_orders")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={appRoutes.app.keepsakes}>
              {t("checkout__success__keep_shopping")}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};
