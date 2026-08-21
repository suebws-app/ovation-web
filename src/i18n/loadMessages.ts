import type { AbstractIntlMessages } from "next-intl";

const NAMESPACES = [
  "account",
  "analytics",
  "app",
  "auth",
  "cart",
  "checkout",
  "common",
  "dashboard",
  "errors",
  "event",
  "eventTypes",
  "guest",
  "guests",
  "help",
  "invitation",
  "invitees",
  "keepsakes",
  "kiosk",
  "landing/general",
  "landing/general2",
  "landing/wedding",
  "link",
  "marketing",
  "messages",
  "orders",
  "photos",
  "plans",
  "product",
  "qr",
  "seo",
  "settings",
  "sidebar",
  "signup",
  "validation",
  "weddingPlanner",
] as const;

const loadNamespace = async (
  locale: string,
  namespace: string,
): Promise<AbstractIntlMessages> => {
  try {
    const file = (await import(
      `../../messages/${locale}/${namespace}.json`
    )) as { default: AbstractIntlMessages };
    return file.default;
  } catch {
    return {};
  }
};

export const loadMessages = async (
  locale: string,
): Promise<AbstractIntlMessages> => {
  const files = await Promise.all(
    NAMESPACES.map((namespace) => loadNamespace(locale, namespace)),
  );

  return Object.assign({}, ...files);
};

export const SHELL_NAMESPACES = [
  "common",
  "errors",
  "sidebar",
  "validation",
] as const;

export const loadNamespaces = async (
  locale: string,
  namespaces: readonly string[],
): Promise<AbstractIntlMessages> => {
  const files = await Promise.all(
    namespaces.flatMap((namespace) =>
      locale === "en"
        ? [loadNamespace("en", namespace)]
        : [loadNamespace("en", namespace), loadNamespace(locale, namespace)],
    ),
  );

  return Object.assign({}, ...files);
};

export const loadShellMessages = (
  locale: string,
  extras: readonly string[] = [],
): Promise<AbstractIntlMessages> =>
  loadNamespaces(locale, [...SHELL_NAMESPACES, ...extras]);

export const loadPublicShellMessages = (
  locale: string,
): Promise<AbstractIntlMessages> => loadShellMessages(locale);
