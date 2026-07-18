export const REGION_CONSENT_COOKIE = "ovation-region-consent";

export const CONSENT_REQUIRED_COUNTRIES = new Set<string>([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
]);

export type RegionConsentMode = "required" | "not-required";

export const regionConsentModeFor = (
  countryCode: string | null | undefined,
): RegionConsentMode => {
  if (!countryCode) return "required";
  return CONSENT_REQUIRED_COUNTRIES.has(countryCode.toUpperCase())
    ? "required"
    : "not-required";
};

export const readRegionConsentMode = (): RegionConsentMode => {
  if (typeof document === "undefined") return "required";
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${REGION_CONSENT_COOKIE}=`));
  if (!cookie) return "required";
  return cookie.slice(REGION_CONSENT_COOKIE.length + 1) === "not-required"
    ? "not-required"
    : "required";
};
