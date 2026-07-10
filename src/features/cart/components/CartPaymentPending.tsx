"use client";

import { useTranslations } from "next-intl";
import { LockIcon } from "@ovation/icons/LockIcon";
import { Button } from "@ovation/ui/components/Button";

type CartPaymentPendingProps = {
  onOpenCheckout?: () => void;
};

export const CartPaymentPending = ({
  onOpenCheckout,
}: CartPaymentPendingProps) => {
  const t = useTranslations();
  return (
    <div
      className="rounded-20 border-border bg-card flex flex-col items-center gap-4 border p-10 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="bg-muted/40 text-muted-foreground flex size-14 items-center justify-center rounded-full">
        <LockIcon width={22} height={22} />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="type-h3 font-serif font-semibold tracking-tight">
          {t("cart__payment__redirect_title")}
        </h2>
        <p className="type-body-small text-muted-foreground max-w-100 leading-relaxed">
          {t("cart__payment__redirect_body")}
        </p>
      </div>
      {onOpenCheckout && (
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={onOpenCheckout}
        >
          {t("cart__payment__redirect_open")}
        </Button>
      )}
    </div>
  );
};
