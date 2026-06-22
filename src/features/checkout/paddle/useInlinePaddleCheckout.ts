"use client";

import { useCallback, useEffect, useRef } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { clientEnv as env } from "@/lib/utils/env.client";
import { useOptimisticPlanStore } from "../useOptimisticPlanStore";

type PaddleCustomData = { orderId?: string } | undefined;

type UseInlinePaddleCheckoutOptions = {
  userEmail: string | null;
  onCompleted: (orderId?: string) => void;
  onClosed: (orderId?: string) => void;
};

export const useInlinePaddleCheckout = ({
  userEmail,
  onCompleted,
  onClosed,
}: UseInlinePaddleCheckoutOptions) => {
  const paddleRef = useRef<Paddle | null>(null);
  const completedRef = useRef(false);
  const onCompletedRef = useRef(onCompleted);
  const onClosedRef = useRef(onClosed);
  const emailRef = useRef(userEmail);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
    onClosedRef.current = onClosed;
    emailRef.current = userEmail;
  }, [onCompleted, onClosed, userEmail]);

  const ensurePaddle = useCallback(async (): Promise<Paddle | null> => {
    if (paddleRef.current) return paddleRef.current;
    const paddle = await initializePaddle({
      environment: env.PADDLE_ENV,
      token: env.PADDLE_CLIENT_TOKEN,
      eventCallback(event) {
        if (event.name === "checkout.completed") {
          completedRef.current = true;
          const orderId = (event.data?.custom_data as PaddleCustomData)
            ?.orderId;
          if (!orderId) {
            console.error(
              "Paddle checkout.completed missing custom_data.orderId",
            );
          } else {
            useOptimisticPlanStore.getState().markActivating(orderId);
          }
          paddleRef.current?.Checkout.close();
          onCompletedRef.current(orderId);
        }
        if (event.name === "checkout.closed") {
          if (completedRef.current) return;
          const orderId = (event.data?.custom_data as PaddleCustomData)
            ?.orderId;
          onClosedRef.current(orderId);
        }
      },
    });
    paddleRef.current = paddle ?? null;
    return paddleRef.current;
  }, []);

  const open = useCallback(
    async (transactionId: string): Promise<boolean> => {
      completedRef.current = false;
      try {
        const paddle = await ensurePaddle();
        if (!paddle) return false;
        paddle.Checkout.open({
          transactionId,
          ...(emailRef.current
            ? { customer: { email: emailRef.current } }
            : {}),
        });
        return true;
      } catch {
        return false;
      }
    },
    [ensurePaddle],
  );

  const close = useCallback(() => {
    paddleRef.current?.Checkout.close();
  }, []);

  useEffect(() => {
    return () => {
      paddleRef.current?.Checkout.close();
    };
  }, []);

  return { open, close };
};
