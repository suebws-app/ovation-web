import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";
import { locales } from "./i18n/config";
import { env } from "./lib/utils/env";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = ["/app", "/settings"];
const AUTH_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];
const MARKETING_PREFIXES = [
  "/about",
  "/examples",
  "/how-it-works",
  "/pricing",
  "/legal",
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

export const proxy = (request: Request) => {
  if (
    env.IS_PRODUCTION &&
    env.CF_ORIGIN_TOKEN &&
    request.headers.get("x-cf-origin-token") !== env.CF_ORIGIN_TOKEN
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathnameWithoutLocale = stripLocalePrefix(pathname);

  const isAuthenticated = Boolean(
    getSessionCookie(request, { cookiePrefix: "ovation" }),
  );

  if (
    matchesPrefix(pathnameWithoutLocale, PROTECTED_PREFIXES) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }

  if (pathnameWithoutLocale === "/settings") {
    const target = new URL(request.url);
    target.pathname = pathname.endsWith("/")
      ? `${pathname}profile`
      : `${pathname}/profile`;
    return Response.redirect(target);
  }

  const POST_AUTH_SIGNUP_STEPS = ["/sign-up/verify", "/sign-up/plan", "/sign-up/done"];
  const isPostAuthSignUpStep = POST_AUTH_SIGNUP_STEPS.some(
    (p) =>
      pathnameWithoutLocale === p || pathnameWithoutLocale.startsWith(`${p}/`),
  );
  const isHomepage = pathnameWithoutLocale === "/";
  const isMarketing = matchesPrefix(pathnameWithoutLocale, MARKETING_PREFIXES);
  const isAuthPage =
    matchesPrefix(pathnameWithoutLocale, AUTH_PREFIXES) &&
    !isPostAuthSignUpStep;

  if (isAuthenticated && (isHomepage || isMarketing || isAuthPage)) {
    return Response.redirect(new URL("/app", request.url));
  }

  return intlMiddleware(request as never);
};

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
