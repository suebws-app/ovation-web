import { formatNativeLanguageName } from "@/lib/utils/localeFormatters";

const COUNTRY_BY_LOCALE: Record<string, string> = {
  en: "GB",
  es: "ES",
  pt: "PT",
  it: "IT",
  de: "DE",
  id: "ID",
  ms: "MY",
  tr: "TR",
  nl: "NL",
  no: "NO",
  th: "TH",
  da: "DK",
  fi: "FI",
  ko: "KR",
  pl: "PL",
  ro: "RO",
  hu: "HU",
  lt: "LT",
  lv: "LV",
  et: "EE",
  el: "GR",
  sk: "SK",
  sl: "SI",
  hr: "HR",
  cs: "CZ",
  vi: "VN",
  uk: "UA",
  sv: "SE",
  fr: "FR",
  fil: "PH",
};

const REGIONAL_INDICATOR_A_OFFSET = 0x1f1e6 - "A".charCodeAt(0);
const FALLBACK_FLAG = "🌐";

const countryCodeToFlag = (countryCode: string): string => {
  if (!/^[A-Z]{2}$/.test(countryCode)) return FALLBACK_FLAG;
  const codePoints = [...countryCode].map(
    (char) => char.charCodeAt(0) + REGIONAL_INDICATOR_A_OFFSET,
  );
  return String.fromCodePoint(...codePoints);
};

const resolveFlag = (code: string): string => {
  const country = COUNTRY_BY_LOCALE[code];
  return country ? countryCodeToFlag(country) : FALLBACK_FLAG;
};

export type LanguageMeta = {
  code: string;
  flag: string;
  nativeName: string;
  englishName: string;
};

const formatEnglishLanguageName = (code: string): string => {
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
    return displayNames.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

export const getLanguageMeta = (code: string): LanguageMeta => ({
  code,
  flag: resolveFlag(code),
  nativeName: formatNativeLanguageName(code),
  englishName: formatEnglishLanguageName(code),
});
