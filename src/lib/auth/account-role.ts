import type { AccountType } from "@/lib/api/types";

/**
 * The consumer (self-serve host) persona. The value shifted from "couple" to
 * "host" during the multi-event generalization; "couple" is still accepted as
 * a legacy alias for existing links, sessions, and stored data.
 */
export const CONSUMER_ACCOUNT_TYPE: AccountType = "host";

export const isConsumerRole = (value: string | null | undefined): boolean =>
  value === "host" || value === "couple";

export const isProRole = (value: string | null | undefined): boolean =>
  value === "pro";

/** Normalize a role param / stored value to the current canonical value. */
export const normalizeAccountType = (
  value: string | null | undefined,
): AccountType => (value === "pro" ? "pro" : CONSUMER_ACCOUNT_TYPE);
