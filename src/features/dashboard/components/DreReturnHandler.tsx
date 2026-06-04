"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { paymentsClient } from "@/lib/api/payments-client";

const PADDLE_TXN_PARAM = "_ptxn";
const MAX_ATTEMPTS = 6;
const RETRY_DELAY_MS = 1500;

export const DreReturnHandler = () => {
  const router = useRouter();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    const url = new URL(window.location.href);
    const transactionId = url.searchParams.get(PADDLE_TXN_PARAM);
    if (!transactionId) return;
    ranRef.current = true;

    const stripParam = () => {
      url.searchParams.delete(PADDLE_TXN_PARAM);
      window.history.replaceState({}, "", url.toString());
    };

    const run = async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          const result = await paymentsClient.syncDreTransaction(transactionId);
          if (result.applied || result.status === "already_processed") {
            stripParam();
            router.refresh();
            return;
          }
        } catch {
          break;
        }
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
      stripParam();
    };

    void run();
  }, [router]);

  return null;
};
