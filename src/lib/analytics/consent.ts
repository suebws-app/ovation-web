const COOKIE_NAME = "cookieyes-consent";
const ANALYTICS_PATTERN = /"?analytics"?\s*:\s*"?yes"?/i;
const ADVERTISEMENT_PATTERN = /"?advertisement"?\s*:\s*"?yes"?/i;
const CONSENT_UPDATE_EVENT = "cookieyes_consent_update";

export type AnalyticsConsent = "granted" | "denied" | "unknown";

const readCookieYesRaw = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.slice(COOKIE_NAME.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseAnalyticsFromRaw = (raw: string | null): AnalyticsConsent => {
  if (!raw) return "unknown";
  if (ANALYTICS_PATTERN.test(raw)) return "granted";
  if (ADVERTISEMENT_PATTERN.test(raw)) return "granted";
  return "denied";
};

export const readAnalyticsConsent = (): AnalyticsConsent =>
  parseAnalyticsFromRaw(readCookieYesRaw());

interface CookieYesEventDetail {
  accepted?: string[];
  rejected?: string[];
  categories?: Record<string, string | boolean>;
}

const analyticsFromEvent = (event: Event): AnalyticsConsent => {
  const detail = (event as CustomEvent<CookieYesEventDetail>).detail;
  if (!detail) return readAnalyticsConsent();

  if (Array.isArray(detail.accepted)) {
    if (detail.accepted.some((c) => /analytics|performance/i.test(c))) {
      return "granted";
    }
    if (detail.accepted.length > 0) return "denied";
  }

  if (detail.categories) {
    const analytics =
      detail.categories["analytics"] ?? detail.categories["performance"];
    if (analytics === "yes" || analytics === true) return "granted";
    if (analytics === "no" || analytics === false) return "denied";
  }

  return readAnalyticsConsent();
};

export const subscribeToConsentUpdates = (
  callback: (consent: AnalyticsConsent) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => callback(analyticsFromEvent(event));
  window.addEventListener(CONSENT_UPDATE_EVENT, handler);
  document.addEventListener(CONSENT_UPDATE_EVENT, handler);
  return () => {
    window.removeEventListener(CONSENT_UPDATE_EVENT, handler);
    document.removeEventListener(CONSENT_UPDATE_EVENT, handler);
  };
};
