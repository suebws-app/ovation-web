"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/components/Toaster";
import { appRoutes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useBuyNowStore } from "@/features/cart/store/useBuyNowStore";
import { useOptimisticPlanStore } from "./useOptimisticPlanStore";
import { useConfirmCheckout } from "./hooks/useConfirmCheckout";

type CheckoutSuccessClientProps = {
  orderId: string;
};

export const CheckoutSuccessClient = ({
  orderId,
}: CheckoutSuccessClientProps) => {
  const t = useTranslations();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clear);
  const clearBuyNow = useBuyNowStore((s) => s.clear);
  const markActivating = useOptimisticPlanStore((s) => s.markActivating);
  const clearActivating = useOptimisticPlanStore((s) => s.clear);
  const firedRef = useRef(false);

  useEffect(() => {
    markActivating(orderId);
  }, [orderId, markActivating]);

  const { kind, done } = useConfirmCheckout({ orderId });

  useEffect(() => {
    if (!done || firedRef.current) return;
    firedRef.current = true;

    const message =
      kind === "plan"
        ? t("checkout__success__toast_plan")
        : kind === "order"
          ? t("checkout__success__toast_order")
          : t("checkout__success__toast_payment");

    if (kind === "order") {
      clearCart();
      clearBuyNow();
      clearActivating();
    } else if (kind === "pending") {
      clearActivating();
    }

    toast.success(message);
    if (kind === "plan") router.refresh();
    router.replace(appRoutes.app.root);
  }, [done, kind, t, router, clearCart, clearBuyNow, clearActivating]);

  return null;
};
