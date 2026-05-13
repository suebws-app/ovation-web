"use client";

import { useEffect } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { env } from "@/lib/utils/env";
import { ordersClient } from "@/lib/api/orders-client";
import { CompletionRedirectingState } from "./CompletionRedirectingState";

type CompletionCheckoutStateProps = {
  transactionId: string;
  orderId: string;
  successUrl: string;
  email: string;
};

export const CompletionCheckoutState = ({
  transactionId,
  orderId,
  successUrl,
  email,
}: CompletionCheckoutStateProps) => {
  useEffect(() => {
    let cancelled = false;

    initializePaddle({
      environment: env.PADDLE_ENV,
      token: env.PADDLE_CLIENT_TOKEN,
      eventCallback(event) {
        if (event.name === "checkout.completed") {
          ordersClient.get(orderId).finally(() => {
            if (!cancelled) window.location.assign(successUrl);
          });
        }
      },
    }).then((paddle) => {
      if (cancelled || !paddle) return;
      paddle.Checkout.open({
        transactionId,
        customer: { email },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [transactionId, orderId, successUrl, email]);

  return <CompletionRedirectingState />;
};
