import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { loadMessages } from "./loadMessages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }

  const englishMessages = await loadMessages("en");
  const localeMessages =
    locale === "en" ? englishMessages : await loadMessages(locale);

  return {
    locale,
    messages: { ...englishMessages, ...localeMessages },
  };
});
