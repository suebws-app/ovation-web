"use client";

import { useEffect } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { env } from "@/lib/utils/env";
import { ordersClient } from "@/lib/api/orders-client";
import { appRoutes } from "@/lib/routes";
import { CompletionRedirectingState } from "./CompletionRedirectingState";

type CompletionCheckoutStateProps = {
  transactionId: string;
  orderId: string;
  successUrl: string;
  email: string;
  onCompleted?: (orderId: string) => void;
};

export const CompletionCheckoutState = ({
  transactionId,
  orderId,
  successUrl,
  email,
  onCompleted,
}: CompletionCheckoutStateProps) => {
  useEffect(() => {
    let cancelled = false;
    const goBackToPlan = () => {
      if (!cancelled) window.location.assign(appRoutes.auth.signUpPlan);
    };

    initializePaddle({
      environment: env.PADDLE_ENV,
      token: env.PADDLE_CLIENT_TOKEN,
      eventCallback(event) {
        if (cancelled) return;
        if (event.name === "checkout.completed") {
          if (onCompleted) {
            onCompleted(orderId);
            return;
          }
          ordersClient.get(orderId).finally(() => {
            if (!cancelled) window.location.assign(successUrl);
          });
        }
        if (event.name === "checkout.closed") {
          goBackToPlan();
        }
        if (event.name === "checkout.error") {
          goBackToPlan();
        }
      },
    })
      .then((paddle) => {
        if (cancelled) return;
        if (!paddle) {
          goBackToPlan();
          return;
        }
        paddle.Checkout.open({
          transactionId,
          customer: { email },
        });
      })
      .catch(() => {
        goBackToPlan();
      });

    return () => {
      cancelled = true;
    };
  }, [transactionId, orderId, successUrl, email, onCompleted]);

  return <CompletionRedirectingState />;
};
