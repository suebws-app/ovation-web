"use client";

import { useCheckoutFlow } from "@/features/checkout/hooks/useCheckoutFlow";
import { CheckoutCreating } from "@/features/checkout/components/CheckoutCreating";
import { CheckoutRedirecting } from "@/features/checkout/components/CheckoutRedirecting";
import { CheckoutError } from "@/features/checkout/components/CheckoutError";

export const CheckoutPage = () => {
  const { state, retry } = useCheckoutFlow();

  if (state.kind === "creating") return <CheckoutCreating />;
  if (state.kind === "redirecting") return <CheckoutRedirecting />;
  return <CheckoutError message={state.message} onRetry={retry} />;
};
