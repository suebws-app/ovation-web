import { env } from "@/lib/utils/env";
import {
  clearAuthCookies,
  readRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import type { AuthResult, ApiErrorBody } from "@/lib/api/types";

export const POST = async (): Promise<Response> => {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) {
    return Response.json(
      {
        error: {
          code: "UNAUTHENTICATED",
          message: "No refresh token",
          details: {},
        },
      },
      { status: 401 },
    );
  }

  const upstream = await fetch(`${env.API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  const json = (await upstream.json().catch(() => null)) as
    | { data?: AuthResult }
    | ApiErrorBody
    | null;

  if (!upstream.ok) {
    await clearAuthCookies();
    return Response.json(json, { status: upstream.status });
  }

  const result = (json as { data?: AuthResult } | null)?.data;
  if (!result) {
    await clearAuthCookies();
    return Response.json(
      {
        error: {
          code: "INVALID_RESPONSE",
          message: "Refresh failed",
          details: {},
        },
      },
      { status: 502 },
    );
  }

  await setAuthCookies({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
  });
  return Response.json({ data: { user: result.user } });
};
