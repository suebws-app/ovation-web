export type FormatDateOptions = Intl.DateTimeFormatOptions & {
  fallback?: string;
};

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

export const formatDate = (
  iso: string | null | undefined,
  locale: string,
  options: FormatDateOptions = {},
): string => {
  const { fallback = "—", ...formatOptions } = options;
  if (!iso) return fallback;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString(locale, {
    ...DEFAULT_OPTIONS,
    ...formatOptions,
  });
};

export const formatLongDate = (
  iso: string | null | undefined,
  locale: string,
  fallback = "—",
): string => formatDate(iso, locale, { month: "long", fallback });

export const toIsoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const formatYear = (iso: string | null | undefined): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return String(d.getFullYear());
};

export const formatWeekdayDate = (
  iso: string,
  locale?: string,
  fallback = "Earlier",
): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
