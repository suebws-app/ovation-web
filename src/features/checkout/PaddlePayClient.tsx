"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { initializePaddle } from "@paddle/paddle-js";
import { useRouter } from "@/i18n/navigation";
import { env } from "@/lib/utils/env";
import { appRoutes } from "@/lib/routes";

type PaddlePayClientProps = {
  userEmail: string | null;
};

export const PaddlePayClient = ({ userEmail }: PaddlePayClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("_ptxn");

  useEffect(() => {
    if (!transactionId) {
      router.replace(appRoutes.home);
      return;
    }

    let cancelled = false;

    initializePaddle({
      environment: env.PADDLE_ENV,
      token: env.PADDLE_CLIENT_TOKEN,
      eventCallback(event) {
        if (cancelled) return;
        if (event.name === "checkout.completed") {
          const customData = event.data?.custom_data as
            | { orderId?: string }
            | undefined;
          const orderId = customData?.orderId;
          window.location.assign(
            orderId ? appRoutes.checkout.success(orderId) : appRoutes.home,
          );
        }
        if (event.name === "checkout.closed") {
          const customData = event.data?.custom_data as
            | { orderId?: string }
            | undefined;
          const orderId = customData?.orderId;
          window.location.assign(
            orderId ? appRoutes.checkout.cancel(orderId) : appRoutes.home,
          );
        }
      },
    }).then((paddle) => {
      if (cancelled || !paddle) return;
      paddle.Checkout.open({
        transactionId,
        ...(userEmail ? { customer: { email: userEmail } } : {}),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [transactionId, router, userEmail]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <p className="type-body text-muted-foreground animate-pulse">
        Loading checkout…
      </p>
    </div>
  );
};
