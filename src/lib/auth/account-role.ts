/**
 * The account types the app still writes. `AccountType` in the API types keeps
 * the legacy "couple" value so existing sessions and stored data parse; nothing
 * should ever send it — the database only accepts "host" and "pro".
 */
export type CanonicalAccountType = "host" | "pro";

/**
 * The consumer (self-serve host) persona. The value shifted from "couple" to
 * "host" during the multi-event generalization; "couple" is still accepted as
 * a legacy alias for existing links, sessions, and stored data.
 */
export const CONSUMER_ACCOUNT_TYPE: CanonicalAccountType = "host";

export const isConsumerRole = (value: string | null | undefined): boolean =>
  value === "host" || value === "couple";

export const isProRole = (value: string | null | undefined): boolean =>
  value === "pro";

/** Normalize a role param / stored value to the current canonical value. */
export const normalizeAccountType = (
  value: string | null | undefined,
): CanonicalAccountType => (value === "pro" ? "pro" : CONSUMER_ACCOUNT_TYPE);
