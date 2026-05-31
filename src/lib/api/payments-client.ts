import { clientFetch } from "./client";
import type {
  BillingPortalSessionInput,
  BillingPortalSessionResult,
  CartTotalsInput,
  CartTotalsResult,
  CheckoutSessionInput,
  CheckoutSessionResult,
  DreCheckoutSessionInput,
  DreCheckoutSessionResult,
  ProCheckoutSessionInput,
  ProCheckoutSessionResult,
} from "./types";

export const paymentsClient = {
  createCheckoutSession: (input: CheckoutSessionInput) =>
    clientFetch<CheckoutSessionResult>("/payments/checkout-session", {
      method: "POST",
      body: input,
    }),

  createProCheckoutSession: (input: ProCheckoutSessionInput) =>
    clientFetch<ProCheckoutSessionResult>("/payments/pro-checkout-session", {
      method: "POST",
      body: input,
    }),

  createBillingPortalSession: (input: BillingPortalSessionInput = {}) =>
    clientFetch<BillingPortalSessionResult>(
      "/payments/billing-portal-session",
      { method: "POST", body: input },
    ),

  computeCartTotals: (input: CartTotalsInput) =>
    clientFetch<CartTotalsResult>("/payments/cart-totals", {
      method: "POST",
      body: input,
    }),

  createDreCheckoutSession: (input: DreCheckoutSessionInput) =>
    clientFetch<DreCheckoutSessionResult>("/payments/dre-checkout-session", {
      method: "POST",
      body: input,
    }),
};
