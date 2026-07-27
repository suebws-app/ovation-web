export const getOrigin = (fallback = ""): string =>
  typeof window !== "undefined" ? window.location.origin : fallback;

const IN_APP_UA_PATTERNS = [
  "Instagram",
  "FBAN",
  "FBAV",
  "FB_IAB",
  "FBIOS",
  "Twitter",
  "Line/",
  "LinkedInApp",
  "Snapchat",
  "Pinterest",
  "WhatsApp",
  "MicroMessenger",
  "TikTok",
  "musical_ly",
  "BytedanceWebview",
  "KAKAOTALK",
  "GSA/",
] as const;

export const isInAppBrowser = (userAgent?: string): boolean => {
  const ua =
    userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (!ua) return false;

  if (IN_APP_UA_PATTERNS.some((pattern) => ua.includes(pattern))) return true;

  if (/;\s*wv\)/i.test(ua)) return true;

  const isIOS = /iPhone|iPad|iPod/.test(ua);
  if (isIOS && /AppleWebKit/.test(ua) && !/Safari\//.test(ua)) return true;

  return false;
};

export type MobilePlatform = "ios" | "android" | "other";

export const getMobilePlatform = (userAgent?: string): MobilePlatform => {
  const ua =
    userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (!ua) return "other";
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
};
