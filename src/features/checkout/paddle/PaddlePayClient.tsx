"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { isInAppBrowser } from "@/lib/utils/browser";

import { CheckoutLoading } from "./CheckoutLoading";
import { InAppBrowserPrompt } from "./InAppBrowserPrompt";
import { useInlinePaddleCheckout } from "./useInlinePaddleCheckout";

type PaddlePayClientProps = {
  userEmail: string | null;
};

const subscribeNoop = () => () => {};
const getInAppSnapshot = () => isInAppBrowser();
const getInAppServerSnapshot = () => false;

export const PaddlePayClient = ({ userEmail }: PaddlePayClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("_ptxn");
  const inAppBrowser = useSyncExternalStore(
    subscribeNoop,
    getInAppSnapshot,
    getInAppServerSnapshot,
  );
  const [overrideBlock, setOverrideBlock] = useState(false);
  const blocked = inAppBrowser && !overrideBlock;

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
    if (blocked) return;
    void open(transactionId);
  }, [transactionId, router, blocked, open]);

  if (blocked) {
    return (
      <InAppBrowserPrompt onContinueAnyway={() => setOverrideBlock(true)} />
    );
  }

  return <CheckoutLoading />;
};
