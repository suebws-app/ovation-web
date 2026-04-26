import "server-only";
import { env } from "@/lib/utils/env";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { AuthResult, ApiErrorBody } from "@/lib/api/types";

const BACKEND_AUTH_BASE = `${env.API_URL}/api/v1/auth`;

const errorResponse = (status: number, body: ApiErrorBody | unknown) =>
  Response.json(body, { status });

export const forwardAuthRequest = async (
  endpoint: string,
  request: Request,
): Promise<Response> => {
  const body = await request.text();
  const upstream = await fetch(`${BACKEND_AUTH_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(request.headers.get("accept-language") && {
        "accept-language": request.headers.get("accept-language") as string,
      }),
    },
    body: body || undefined,
    cache: "no-store",
  });

  const json = (await upstream.json().catch(() => null)) as
    | { data?: AuthResult }
    | ApiErrorBody
    | null;

  if (!upstream.ok) {
    return errorResponse(
      upstream.status,
      json ?? {
        error: {
          code: "HTTP_ERROR",
          message: upstream.statusText,
          details: {},
        },
      },
    );
  }

  const result = (json as { data?: AuthResult } | null)?.data;
  if (!result || !result.accessToken || !result.refreshToken) {
    return Response.json(json, { status: upstream.status });
  }

  await setAuthCookies({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
  });

  return Response.json(
    { data: { user: result.user } },
    { status: upstream.status },
  );
};
