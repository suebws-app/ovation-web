import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";
import { locales } from "./i18n/config";
import { serverEnv as env } from "./lib/utils/env.server";
import { buildCsp } from "./lib/utils/csp";
import {
  REGION_CONSENT_COOKIE,
  regionConsentModeFor,
} from "./lib/analytics/region";

const REGION_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24;

const setRegionConsentCookie = (
  request: NextRequest,
  response: NextResponse,
): void => {
  if (request.cookies.has(REGION_CONSENT_COOKIE)) return;
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-forwarded-country");
  const mode = regionConsentModeFor(country);
  response.cookies.set(REGION_CONSENT_COOKIE, mode, {
    path: "/",
    sameSite: "lax",
    secure: env.IS_PRODUCTION,
    maxAge: REGION_CONSENT_MAX_AGE_SECONDS,
  });
};

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = [
  "/home",
  "/analytics",
  "/messages",
  "/events",
  "/guests",
  "/gallery",
  "/shop",
  "/orders",
  "/cart",
  "/kiosk",
  "/link",
  "/help",
  "/account",
  "/qr-code",
  "/settings",
];
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

const getLocalePrefix = (pathname: string): string => {
  const possibleLocale = pathname.split("/")[1];
  if (
    possibleLocale &&
    (locales as readonly string[]).includes(possibleLocale)
  ) {
    return `/${possibleLocale}`;
  }
  return "";
};

const matchesPrefix = (pathname: string, prefixes: string[]): boolean =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const generateNonce = (): string =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") || pathname.startsWith("/monitoring")) {
    return NextResponse.next();
  }

  if (
    env.IS_PRODUCTION &&
    env.CF_ORIGIN_TOKEN &&
    request.headers.get("x-origin-token") !== env.CF_ORIGIN_TOKEN
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const pathnameWithoutLocale = stripLocalePrefix(pathname);
  const localePrefix = getLocalePrefix(pathname);

  const isAuthenticated = Boolean(
    getSessionCookie(request, { cookiePrefix: "ovation" }),
  );

  const isLegacyKeepsakeCustomizer =
    pathnameWithoutLocale.startsWith("/keepsakes/");

  const isPublicKioskRoute = /^\/kiosk\/[^/]+/.test(pathnameWithoutLocale);

  if (
    !isPublicKioskRoute &&
    (matchesPrefix(pathnameWithoutLocale, PROTECTED_PREFIXES) ||
      isLegacyKeepsakeCustomizer) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL(`${localePrefix}/sign-in`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl, { status: 307 });
  }

  if (isAuthenticated && pathnameWithoutLocale === "/keepsakes") {
    return NextResponse.redirect(new URL(`${localePrefix}/shop`, request.url), {
      status: 307,
    });
  }

  if (pathnameWithoutLocale === "/settings") {
    const target = new URL(request.url);
    target.pathname = pathname.endsWith("/")
      ? `${pathname}profile`
      : `${pathname}/profile`;
    return NextResponse.redirect(target, { status: 308 });
  }

  const POST_AUTH_SIGNUP_STEPS = ["/verify", "/plans", "/checkout"];
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
    return NextResponse.redirect(new URL(`${localePrefix}/home`, request.url), {
      status: 307,
    });
  }

  const useStrictCsp =
    env.IS_PRODUCTION &&
    !isPublicKioskRoute &&
    (matchesPrefix(pathnameWithoutLocale, PROTECTED_PREFIXES) ||
      matchesPrefix(pathnameWithoutLocale, AUTH_PREFIXES) ||
      isPostAuthSignUpStep);

  const nonce = useStrictCsp ? generateNonce() : undefined;
  const csp = buildCsp(nonce);
  if (nonce) {
    request.headers.set("x-nonce", nonce);
    request.headers.set("Content-Security-Policy", csp);
  }

  const response = intlMiddleware(request as never) as NextResponse;
  response.headers.set("Content-Security-Policy", csp);
  setRegionConsentCookie(request, response);

  if (
    !isPublicKioskRoute &&
    (matchesPrefix(pathnameWithoutLocale, PROTECTED_PREFIXES) ||
      matchesPrefix(pathnameWithoutLocale, AUTH_PREFIXES))
  ) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
