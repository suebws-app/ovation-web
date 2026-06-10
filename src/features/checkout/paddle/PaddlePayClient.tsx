"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useRouter } from "@/i18n/navigation";
import { clientEnv as env } from "@/lib/utils/env.client";
import { appRoutes } from "@/lib/routes";

import { CheckoutLoading } from "./CheckoutLoading";

type PaddlePayClientProps = {
  userEmail: string | null;
};

export const PaddlePayClient = ({ userEmail }: PaddlePayClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("_ptxn");
  const paddleRef = useRef<Paddle | null>(null);
  const completedRef = useRef(false);

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
          completedRef.current = true;
          const customData = event.data?.custom_data as
            | { orderId?: string }
            | undefined;
          const orderId = customData?.orderId;
          paddleRef.current?.Checkout.close();
          router.push(
            orderId ? appRoutes.checkout.orderSuccess(orderId) : appRoutes.home,
          );
        }
        if (event.name === "checkout.closed") {
          if (completedRef.current) return;
          const customData = event.data?.custom_data as
            | { orderId?: string }
            | undefined;
          const orderId = customData?.orderId;
          router.push(
            orderId ? appRoutes.checkout.cancel(orderId) : appRoutes.home,
          );
        }
      },
    }).then((paddle) => {
      if (cancelled || !paddle) return;
      paddleRef.current = paddle;
      paddle.Checkout.open({
        transactionId,
        ...(userEmail ? { customer: { email: userEmail } } : {}),
      });
    });

    return () => {
      cancelled = true;
      paddleRef.current?.Checkout.close();
    };
  }, [transactionId, router, userEmail]);

  return <CheckoutLoading />;
};
