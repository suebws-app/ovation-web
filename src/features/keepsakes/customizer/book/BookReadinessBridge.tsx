"use client";

import { useEffect } from "react";
import { type BookBinding } from "./BookFormContext";
import { useBookCheckoutData } from "./useBookCheckoutData";
import type { KeepsakeProductVariant } from "@/lib/api/types";

type BookReadinessBridgeProps = {
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  binding: BookBinding;
  onReadyChange: (ready: boolean) => void;
};

/**
 * Headless: computes checkout readiness from the live form (inside the
 * FormProvider) and reports it up so the wizard can gate the Cover → Checkout
 * step. Renders nothing.
 */
export const BookReadinessBridge = ({
  variants,
  eventId,
  binding,
  onReadyChange,
}: BookReadinessBridgeProps) => {
  const { isReady } = useBookCheckoutData(variants, eventId, binding);

  useEffect(() => {
    onReadyChange(isReady);
  }, [isReady, onReadyChange]);

  return null;
};
