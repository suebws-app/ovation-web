import { env } from "@/lib/utils/env";
import { clearAuthCookies, readAccessToken } from "@/lib/auth/cookies";

export const POST = async (): Promise<Response> => {
  const token = await readAccessToken();
  if (token) {
    await fetch(`${env.API_URL}/api/v1/auth/signout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => undefined);
  }
  await clearAuthCookies();
  return Response.json({ data: { message: "Signed out" } });
};
