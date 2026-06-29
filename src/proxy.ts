import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";
import { locales } from "./i18n/config";
import { serverEnv as env } from "./lib/utils/env.server";
import { buildCsp } from "./lib/utils/csp";

const intlMiddleware = createMiddleware(routing);

const PREVIEW_COOKIE = "preview_access";

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

const matchesPrefix = (pathname: string, prefixes: string[]): boolean =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const hmacHex = async (value: string, secret: string): Promise<string> => {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const generateNonce = (): string =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isComingSoonPage = pathname === "/coming-soon";
  const isComingSoonApi = pathname.startsWith("/api/coming-soon");

  if (
    process.env.COMING_SOON_ENABLED === "true" &&
    !isComingSoonPage &&
    !isComingSoonApi
  ) {
    const password = process.env.COMING_SOON_PASSWORD;
    const secret = process.env.AUTH_COOKIE_SECRET;
    if (password && secret) {
      const token = request.cookies.get(PREVIEW_COOKIE)?.value ?? "";
      const expected = await hmacHex(password, secret);
      if (!timingSafeEqual(token, expected)) {
        const url = request.nextUrl.clone();
        url.pathname = "/coming-soon";
        return NextResponse.redirect(url);
      }
    }
  }

  if (
    isComingSoonApi ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/monitoring")
  ) {
    return NextResponse.next();
  }

  if (isComingSoonPage) {
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", buildCsp());
    return response;
  }

  if (
    env.IS_PRODUCTION &&
    env.CF_ORIGIN_TOKEN &&
    request.headers.get("x-origin-token") !== env.CF_ORIGIN_TOKEN
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const pathnameWithoutLocale = stripLocalePrefix(pathname);

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
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }

  if (isAuthenticated && pathnameWithoutLocale === "/keepsakes") {
    return Response.redirect(new URL("/shop", request.url));
  }

  if (pathnameWithoutLocale === "/settings") {
    const target = new URL(request.url);
    target.pathname = pathname.endsWith("/")
      ? `${pathname}profile`
      : `${pathname}/profile`;
    return Response.redirect(target);
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
    return Response.redirect(new URL("/home", request.url));
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
