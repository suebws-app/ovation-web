"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { initializePaddle } from "@paddle/paddle-js";
import { useRouter } from "@/i18n/navigation";
import { env } from "@/lib/utils/env";
import { appRoutes } from "@/lib/routes";

export const PaddlePayPage = () => {
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
    }).then((paddle) => {
      if (cancelled || !paddle) return;
      paddle.Checkout.open({ transactionId });
    });

    return () => {
      cancelled = true;
    };
  }, [transactionId, router]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <p className="type-body text-muted-foreground animate-pulse">
        Loading checkout…
      </p>
    </div>
  );
};
