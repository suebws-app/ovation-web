import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { locales } from "./i18n/config";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = ["/app", "/account"];
const AUTH_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

const stripLocalePrefix = (pathname: string): string => {
  const segments = pathname.split("/");
  const possibleLocale = segments[1];
  if (
    possibleLocale &&
    (locales as readonly string[]).includes(possibleLocale)
  ) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
};

const matchesPrefix = (pathname: string, prefixes: string[]): boolean =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const parseCookie = (header: string, name: string): string | null => {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ?? null;
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp !== "number" || payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const proxy = (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathnameWithoutLocale = stripLocalePrefix(pathname);

  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = parseCookie(cookieHeader, "auth_token");
  const isAuthenticated = Boolean(token) && !isTokenExpired(token!);

  if (
    matchesPrefix(pathnameWithoutLocale, PROTECTED_PREFIXES) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }

  if (matchesPrefix(pathnameWithoutLocale, AUTH_PREFIXES) && isAuthenticated) {
    return Response.redirect(new URL("/app", request.url));
  }

  return intlMiddleware(request as never);
};

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
