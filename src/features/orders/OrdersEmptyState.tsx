"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import { GiftIcon } from "@ovation/icons/GiftIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const OrdersEmptyState = () => {
  const t = useTranslations();

  return (
    <div className="tablet:py-20 relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
      <div className="bg-primary/8 pointer-events-none absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative">
        <div className="border-primary/15 animate-tap-pulse pointer-events-none absolute -inset-3 rounded-[28px] border" />
        <div className="border-primary/25 pointer-events-none absolute -inset-6 rounded-[36px] border opacity-60" />

        <div className="rounded-20 bg-card border-border relative flex size-40 items-center justify-center border shadow-lg">
          <div className="bg-primary/10 rounded-16 flex size-24 items-center justify-center">
            <BoxIcon
              width={42}
              height={42}
              className="text-primary"
              strokeWidth={1.6}
            />
          </div>
          <div className="bg-primary text-primary-foreground absolute -right-3 -bottom-3 flex size-11 items-center justify-center rounded-full shadow-lg">
            <GiftIcon width={18} height={18} strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="tablet:mt-10 mt-8 flex max-w-md flex-col items-center gap-3">
        <h2 className="type-h2 leading-tight tracking-tight">
          {t("orders__page__empty_title")}
        </h2>
        <p className="type-body-small text-muted-foreground leading-relaxed">
          {t("orders__page__empty_body")}
        </p>
      </div>

      <div className="tablet:mt-6 mt-5 flex w-full max-w-sm flex-col items-center gap-2">
        <Button asChild size="lg" className="w-full rounded-full">
          <Link href={appRoutes.app.keepsakes}>
            <GiftIcon width={16} height={16} />
            {t("orders__page__empty_cta")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
