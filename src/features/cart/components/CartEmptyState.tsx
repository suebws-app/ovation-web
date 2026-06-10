"use client";

import { useTranslations } from "next-intl";
import { CartIcon } from "@ovation/icons/CartIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const CartEmptyState = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card flex flex-col items-center gap-4 border p-12 text-center">
      <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
        <CartIcon width={24} height={24} />
      </div>
      <h2 className="type-h3 font-serif font-semibold tracking-tight">
        {t("cart__empty__title")}
      </h2>
      <p className="text-muted-foreground type-body-small max-w-90">
        {t("cart__empty__body")}
      </p>
      <Button asChild className="rounded-full">
        <Link href={appRoutes.app.keepsakes}>{t("cart__empty__cta")}</Link>
      </Button>
    </div>
  );
};
