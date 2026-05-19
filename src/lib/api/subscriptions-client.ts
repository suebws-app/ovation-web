import { clientFetch } from "./client";
import type { DreInfo } from "./types";

export const subscriptionsClient = {
  dreIntent: () =>
    clientFetch<{ dre: DreInfo }>("/subscriptions/me/dre/intent", {
      method: "POST",
    }),
  dreCancelIntent: () =>
    clientFetch<void>("/subscriptions/me/dre/intent", { method: "DELETE" }),
  dreCancel: () =>
    clientFetch<{ dre: DreInfo }>("/subscriptions/me/dre/cancel", {
      method: "POST",
    }),
  dreResume: () =>
    clientFetch<{ dre: DreInfo }>("/subscriptions/me/dre/resume", {
      method: "POST",
    }),
};
