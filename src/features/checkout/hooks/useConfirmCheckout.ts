"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { ordersClient } from "@/lib/api/orders-client";
import { planPurchasesClient } from "@/lib/api/plan-purchases-client";

export type ConfirmKind = "plan" | "order" | "pending";

type UseConfirmCheckoutOptions = {
  orderId: string;
  intervalMs?: number;
  timeoutMs?: number;
};

type ConfirmState = {
  kind: ConfirmKind;
  done: boolean;
};

const isMissing = (error: unknown) =>
  ApiError.isApiError(error) && (error.status === 404 || error.status === 403);

const tryResolveOnce = async (orderId: string): Promise<ConfirmKind | null> => {
  try {
    const { purchase } = await planPurchasesClient.get(orderId);
    if (purchase.status === "paid") return "plan";
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
  try {
    const { order } = await ordersClient.get(orderId);
    if (order.status === "paid") return "order";
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
  return null;
};

export const useConfirmCheckout = ({
  orderId,
  intervalMs = 1500,
  timeoutMs = 10_000,
}: UseConfirmCheckoutOptions): ConfirmState => {
  const [state, setState] = useState<ConfirmState>({
    kind: "pending",
    done: false,
  });
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const startedAt = performance.now();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      if (cancelledRef.current) return;
      try {
        const resolved = await tryResolveOnce(orderId);
        if (cancelledRef.current) return;
        if (resolved) {
          setState({ kind: resolved, done: true });
          return;
        }
      } catch {
        setState({ kind: "pending", done: true });
        return;
      }
      if (performance.now() - startedAt >= timeoutMs) {
        setState({ kind: "pending", done: true });
        return;
      }
      timer = setTimeout(tick, intervalMs);
    };

    void tick();

    return () => {
      cancelledRef.current = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, intervalMs, timeoutMs]);

  return state;
};
