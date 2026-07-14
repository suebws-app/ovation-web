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
  "guest",
  "guests",
  "help",
  "invitation",
  "invitees",
  "keepsakes",
  "kiosk",
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

const PUBLIC_SHELL_NAMESPACES = [
  "common",
  "errors",
  "marketing",
  "sidebar",
] as const;

export const loadPublicShellMessages = async (
  locale: string,
): Promise<AbstractIntlMessages> => {
  const files = await Promise.all(
    PUBLIC_SHELL_NAMESPACES.flatMap((namespace) =>
      locale === "en"
        ? [loadNamespace("en", namespace)]
        : [loadNamespace("en", namespace), loadNamespace(locale, namespace)],
    ),
  );

  return Object.assign({}, ...files);
};
