import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/better-auth";
import { env } from "@/lib/utils/env";
import type { NextRequest } from "next/server";

const { GET: authGet, POST: authPost } = toNextJsHandler(auth.handler);

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

export const GET = (req: NextRequest) => {
  const blocked = originGuard(req);
  if (blocked) return blocked;
  return authGet(req);
};

export const POST = (req: NextRequest) => {
  const blocked = originGuard(req);
  if (blocked) return blocked;
  return authPost(req);
};
