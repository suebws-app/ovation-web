import "server-only";
import { serverEnv as env } from "@/lib/utils/env.server";

/**
 * Auth emails (verification, password reset) are rendered and sent by the
 * API (branded templates + email_log auditing) via its internal endpoints,
 * authenticated with INTERNAL_API_SECRET.
 */

const sendViaApi = async (
  path: "verification" | "password-reset",
  payload: { to: string; url: string; locale: string },
): Promise<boolean> => {
  if (!env.INTERNAL_API_SECRET) return false;
  try {
    const res = await fetch(
      `${env.INTERNAL_API_URL}/api/v1/internal/emails/${path}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-internal-secret": env.INTERNAL_API_SECRET,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) {
      console.error("[email] API send failed", {
        path,
        status: res.status,
      });
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] API unreachable — falling back to direct send", {
      path,
      error: (err as Error).message,
    });
    return false;
  }
};

export const sendVerificationEmail = async (
  to: string,
  url: string,
  locale: string,
): Promise<void> => {
  const ok = await sendViaApi("verification", { to, url, locale });
  if (!ok) {
    throw new Error("Failed to send verification email");
  }
};

// Intentionally does not throw on failure: better-auth's forget-password
// endpoint returns 200 regardless of whether the user exists, and throwing
// here would leak account existence. Failures are logged inside sendViaApi.
export const sendResetPasswordEmail = async (
  to: string,
  url: string,
  locale: string,
): Promise<void> => {
  await sendViaApi("password-reset", { to, url, locale });
};
