"use client";

import { useTranslations } from "next-intl";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type CartCheckoutConfirmationProps = {
  orderId?: string | null;
};

export const CartCheckoutConfirmation = ({
  orderId,
}: CartCheckoutConfirmationProps) => {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="rounded-20 border-border bg-card flex flex-col items-center gap-5 border p-10 text-center">
      <span className="bg-secondary/15 text-secondary flex size-16 items-center justify-center rounded-full">
        <CheckIcon width={28} height={28} />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="type-h2 font-serif font-semibold tracking-tight">
          {t("cart__confirm__title")}
        </h2>
        <p className="type-body-small text-muted-foreground max-w-100 leading-relaxed">
          {t("cart__confirm__body")}
        </p>
        {orderId && (
          <p className="type-caption text-muted-foreground mt-1">
            {t("cart__confirm__reference", { id: orderId })}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          type="button"
          size="lg"
          className="rounded-full"
          onClick={() => router.push(appRoutes.app.orders)}
        >
          {t("cart__confirm__view_order")}
        </Button>
        <button
          type="button"
          onClick={() => router.push(appRoutes.app.keepsakes)}
          className="type-caption text-muted-foreground hover:text-foreground cursor-pointer font-semibold"
        >
          {t("cart__confirm__continue")}
        </button>
      </div>
    </div>
  );
};
