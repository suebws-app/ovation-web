import { clientEnv } from "@/lib/utils/env.client";

const normalizeEmail = (email: string): string => {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex === -1) return trimmed;
  const localPart = trimmed.slice(0, atIndex).split("+")[0];
  return `${localPart}@${trimmed.slice(atIndex + 1)}`;
};

const excludedEmails = new Set(
  clientEnv.POSTHOG_EXCLUDED_EMAILS.split(",")
    .map(normalizeEmail)
    .filter(Boolean),
);

export const isExcludedFromAnalytics = (email: string): boolean =>
  excludedEmails.has(normalizeEmail(email));
