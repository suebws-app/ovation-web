"use client";

import { useEffect, useRef } from "react";
import { eventsClient } from "@/lib/api/events-client";
import { planPurchasesClient } from "@/lib/api/plan-purchases-client";
import { ApiError } from "@/lib/api/client";

const STORAGE_KEY = "ovation_pending_event_data";

type PendingEventData = {
  partnerAName: string;
  partnerBName: string;
  weddingDate: string | null;
  venueName: string | null;
  desiredSlug: string | null;
};

const SLUG_RE = /^[a-z0-9-]{4,20}$/;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isPendingSubscription = (error: unknown) =>
  ApiError.isApiError(error) &&
  /pro_subscription_required/i.test(error.code ?? error.message ?? "");

const readPending = (): PendingEventData | null => {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage?.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingEventData;
  } catch {
    return null;
  }
};

type PendingEventCreatorProps = {
  orderId: string;
};

export const PendingEventCreator = ({ orderId }: PendingEventCreatorProps) => {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    const waitForActivation = async (): Promise<boolean> => {
      const maxAttempts = 30;
      for (let attempt = 0; attempt < maxAttempts && !cancelled; attempt += 1) {
        try {
          const { purchase } = await planPurchasesClient.get(orderId);
          if (purchase.status === "paid") return true;
        } catch (error) {
          console.warn("[checkout] plan-purchase poll error", error);
        }
        await sleep(2000);
      }
      return false;
    };

    const run = async () => {
      const activated = await waitForActivation();
      if (cancelled) return;
      if (!activated) {
        console.warn(
          "[checkout] plan purchase did not reach paid status within poll window",
        );
        return;
      }

      const data = readPending();
      if (!data) return;

      const maxAttempts = 20;
      for (let attempt = 0; attempt < maxAttempts && !cancelled; attempt += 1) {
        try {
          const { event } = await eventsClient.create({
            partnerAName: data.partnerAName,
            partnerBName: data.partnerBName,
            weddingDate: data.weddingDate ?? undefined,
            venueName: data.venueName ?? undefined,
          });

          if (
            data.desiredSlug &&
            data.desiredSlug !== event.slug &&
            SLUG_RE.test(data.desiredSlug)
          ) {
            try {
              await eventsClient.update(event.id, { slug: data.desiredSlug });
            } catch {
              // ignore slug failure
            }
          }

          window.sessionStorage?.removeItem(STORAGE_KEY);
          return;
        } catch (error) {
          if (!isPendingSubscription(error)) {
            console.error("[signup] pending event creation failed", error);
            return;
          }
          await sleep(1500);
        }
      }
      console.warn(
        "[signup] gave up creating pending event after retries; webhook may not have activated subscription yet",
      );
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return null;
};
