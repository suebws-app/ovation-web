import { defaultLocale, locales } from "@/i18n/config";

export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const localizePath = (locale: string, path: string): string => {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

export const absoluteUrl = (path: string): string =>
  path === "/" ? appUrl : `${appUrl}${path}`;

export const buildLanguageAlternates = (
  path: string,
): Record<string, string> => ({
  ...Object.fromEntries(
    locales.map((locale) => [locale, localizePath(locale, path)]),
  ),
  "x-default": localizePath(defaultLocale, path),
});
