import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/better-auth";
import { env } from "@/lib/utils/env";
import type { NextRequest } from "next/server";

const { GET: authGet, POST: authPost } = toNextJsHandler(auth.handler);

const SIGNIN_FAIL_COOKIE = "ovation_signin_fails";
const SIGNIN_FAIL_THRESHOLD = 3;
const SIGNIN_FAIL_TTL_SECONDS = 60 * 15;

const PATHS_ALWAYS_PROTECTED = new Set<string>([
  "/sign-up/email",
  "/forget-password",
  "/request-password-reset",
]);

const SIGNIN_PATHS = new Set<string>(["/sign-in/email"]);

const extractAuthPath = (req: NextRequest): string => {
  const pathname = new URL(req.url).pathname;
  return pathname.replace(/^\/api\/auth/, "");
};

const getClientIp = (req: NextRequest): string | null => {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return null;
};

const readFailCount = (req: NextRequest): number => {
  const raw = req.cookies.get(SIGNIN_FAIL_COOKIE)?.value;
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const verifyTurnstileToken = async (
  token: string,
  ip: string | null,
): Promise<boolean> => {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  try {
    const params = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    });
    if (ip) params.set("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: params },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
};

const buildFailCookie = (value: string, maxAge: number): string => {
  const parts = [
    `${SIGNIN_FAIL_COOKIE}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
  ];
  if (env.IS_PRODUCTION) parts.push("Secure");
  return parts.join("; ");
};

const cloneWithExtraCookie = (
  response: Response,
  setCookie: string,
): Response => {
  const headers = new Headers(response.headers);
  headers.append("set-cookie", setCookie);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const originGuard = (req: NextRequest): Response | null => {
  if (
    env.IS_PRODUCTION &&
    env.CF_ORIGIN_TOKEN &&
    req.headers.get("x-origin-token") !== env.CF_ORIGIN_TOKEN
  ) {
    console.log({ ss: req.headers.get("x-origin-token") });
    return new Response("Forbidden", { status: 403 });
  }
  return null;
};

const turnstileRejection = (): Response =>
  new Response(
    JSON.stringify({
      code: "TURNSTILE_REQUIRED",
      message: "Captcha verification failed.",
    }),
    {
      status: 400,
      headers: { "content-type": "application/json" },
    },
  );

export const GET = (req: NextRequest) => {
  const blocked = originGuard(req);
  if (blocked) return blocked;
  return authGet(req);
};

export const POST = async (req: NextRequest) => {
  const blocked = originGuard(req);
  if (blocked) return blocked;

  const path = extractAuthPath(req);
  const ip = getClientIp(req);
  const isSignIn = SIGNIN_PATHS.has(path);
  const prevFails = isSignIn ? readFailCount(req) : 0;

  const requiresTurnstile =
    Boolean(env.TURNSTILE_SECRET_KEY) &&
    (PATHS_ALWAYS_PROTECTED.has(path) ||
      (isSignIn && prevFails >= SIGNIN_FAIL_THRESHOLD));

  if (requiresTurnstile) {
    const token = req.headers.get("x-turnstile-token") ?? "";
    const valid = token ? await verifyTurnstileToken(token, ip) : false;
    if (!valid) return turnstileRejection();
  }

  const response = await authPost(req);

  if (isSignIn) {
    const status = response.status;
    if (status >= 400 && status < 500) {
      return cloneWithExtraCookie(
        response,
        buildFailCookie(String(prevFails + 1), SIGNIN_FAIL_TTL_SECONDS),
      );
    }
    if (status >= 200 && status < 300 && prevFails > 0) {
      return cloneWithExtraCookie(response, buildFailCookie("", 0));
    }
  }

  return response;
};
