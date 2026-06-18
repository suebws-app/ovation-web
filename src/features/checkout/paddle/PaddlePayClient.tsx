"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

import { CheckoutLoading } from "./CheckoutLoading";
import { useInlinePaddleCheckout } from "./useInlinePaddleCheckout";

type PaddlePayClientProps = {
  userEmail: string | null;
};

export const PaddlePayClient = ({ userEmail }: PaddlePayClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("_ptxn");

  const { open } = useInlinePaddleCheckout({
    userEmail,
    onCompleted: (orderId) =>
      router.push(
        orderId ? appRoutes.checkout.orderSuccess(orderId) : appRoutes.home,
      ),
    onClosed: (orderId) =>
      router.push(
        orderId ? appRoutes.checkout.cancel(orderId) : appRoutes.home,
      ),
  });

  useEffect(() => {
    if (!transactionId) {
      router.replace(appRoutes.home);
      return;
    }
    void open(transactionId);
  }, [transactionId, router, open]);

  return <CheckoutLoading />;
};
