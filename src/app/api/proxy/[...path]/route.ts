import { cookies, headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { env } from "@/lib/utils/env";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

const buildTargetUrl = (segments: string[], search: string): string => {
  const path = segments.map(encodeURIComponent).join("/");
  return `${env.API_URL}/${path}${search}`;
};

const forwardHeaders = async (
  request: Request,
): Promise<Record<string, string>> => {
  const out: Record<string, string> = {};
  const incoming = await headers();
  incoming.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) return;
    if (key.toLowerCase() === "cookie") return;
    out[key] = value;
  });
  const store = await cookies();
  const token = store.get("auth_token")?.value;
  if (token) out["authorization"] = `Bearer ${token}`;
  out["accept"] = request.headers.get("accept") ?? "application/json";
  out["accept-language"] = await getLocale();
  return out;
};

const proxy = async (
  request: Request,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> => {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = buildTargetUrl(path, incomingUrl.search);

  const init: RequestInit = {
    method: request.method,
    headers: await forwardHeaders(request),
    redirect: "manual",
    cache: "no-store",
  };

  const hasBody =
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.body != null;
  if (hasBody) {
    init.body = await request.arrayBuffer();
  }

  const res = await fetch(targetUrl, init);
  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) return;
    responseHeaders.set(key, value);
  });
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
};

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
