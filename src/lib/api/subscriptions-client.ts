import { clientFetch } from "./client";
import type { MySubscription } from "./types";

export const subscriptionsClient = {
  cancel: () =>
    clientFetch<{ subscription: MySubscription | null }>(
      "/subscriptions/me/cancel",
      { method: "POST" },
    ),
  resume: () =>
    clientFetch<{ subscription: MySubscription | null }>(
      "/subscriptions/me/resume",
      { method: "POST" },
    ),
};
