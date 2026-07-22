import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { serverEnv as env } from "@/lib/utils/env.server";
import { locales, type Locale } from "@/i18n/config";
import { sendResetPasswordEmail, sendVerificationEmail } from "./email-sender";

const SIGNUP_LOCALE_COOKIE = "ovation_signup_locale";
const REFERRAL_COOKIE = "ovation_ref";
const LOCALE_PATH_PATTERN = new RegExp(`^/(${locales.join("|")})(?:/|$)`);
const REFERRAL_CODE_PATTERN = /^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4,16}$/;

const parseSignupReferralCode = (
  request: Request | undefined,
): string | null => {
  if (!request) return null;
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieMatch = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFERRAL_COOKIE}=`));
  if (!cookieMatch) return null;
  const raw = decodeURIComponent(cookieMatch.split("=")[1] ?? "")
    .trim()
    .toUpperCase();
  if (!REFERRAL_CODE_PATTERN.test(raw)) return null;
  return raw;
};

const resolveReferrerIdByCode = async (
  code: string,
): Promise<string | null> => {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM users WHERE referral_code = $1 AND deleted_at IS NULL LIMIT 1`,
    [code],
  );
  return rows[0]?.id ?? null;
};

const recordReferralAttribution = async (
  referrerUserId: string,
  referredUserId: string,
): Promise<void> => {
  if (referrerUserId === referredUserId) return;
  await pool.query(
    `INSERT INTO referrals (referrer_user_id, referred_user_id)
     VALUES ($1, $2)
     ON CONFLICT (referred_user_id) DO NOTHING`,
    [referrerUserId, referredUserId],
  );
};

const isSupportedLocale = (value: string | undefined): value is Locale =>
  Boolean(value) && (locales as readonly string[]).includes(value as string);

const parseSignupLocale = (request: Request | undefined): Locale | null => {
  if (!request) return null;
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieMatch = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SIGNUP_LOCALE_COOKIE}=`));
  if (cookieMatch) {
    const raw = decodeURIComponent(cookieMatch.split("=")[1] ?? "");
    if (isSupportedLocale(raw)) return raw;
  }
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const fromReferer = new URL(referer).pathname.match(LOCALE_PATH_PATTERN);
      if (fromReferer && isSupportedLocale(fromReferer[1]))
        return fromReferer[1];
    } catch {
      // ignore malformed referer
    }
  }
  return null;
};

export const ACCOUNT_DELETED_ERROR_CODE = "ACCOUNT_DELETED";
const ACCOUNT_DELETED_MESSAGE =
  "This account has been deleted. Please contact support.";

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (env.IS_PRODUCTION && !isBuildPhase) {
  if (!env.AUTH_COOKIE_SECRET) {
    throw new Error("AUTH_COOKIE_SECRET must be set in production");
  }
  if (!env.AUTH_HASH_PEPPER) {
    throw new Error("AUTH_HASH_PEPPER must be set in production");
  }
  if (
    !env.TRUSTED_ORIGINS.length ||
    env.TRUSTED_ORIGINS.includes("http://localhost:3000")
  ) {
    throw new Error(
      "TRUSTED_ORIGINS must be set to the production origin in production",
    );
  }
  if (!env.COOKIE_DOMAIN) {
    throw new Error(
      "COOKIE_DOMAIN must be set (e.g. .ovationday.com) in production",
    );
  }
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.IS_PRODUCTION ? 20 : 5,
});

const userLocale = (user: unknown): string => {
  const u = user as { preferredLanguage?: string | null };
  return u.preferredLanguage ?? "en";
};

const peppered = (value: string | null | undefined): string | null => {
  if (!value) return null;
  return createHmac("sha256", env.AUTH_HASH_PEPPER).update(value).digest("hex");
};

const MAX_SESSIONS_PER_USER = 5;
const RISK_LOCKOUT_THRESHOLD = 60;

const enforceSessionCap = async (userId: string): Promise<void> => {
  // LRU evict by last_used_at, keep the most recent (n-1) so the new
  // session about to be created lands within the cap.
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM session WHERE user_id = $1 ORDER BY last_used_at ASC`,
    [userId],
  );
  if (rows.length >= MAX_SESSIONS_PER_USER) {
    const evict = rows.slice(0, rows.length - (MAX_SESSIONS_PER_USER - 1));
    await pool.query(`DELETE FROM session WHERE id = ANY($1::uuid[])`, [
      evict.map((r) => r.id),
    ]);
  }
};

const recordAuthEvent = async (
  event: string,
  userId: string | null,
  ipAddress: string | null,
  userAgent: string | null,
  metadata?: Record<string, unknown>,
): Promise<void> => {
  await pool.query(
    `INSERT INTO auth_events (user_id, event, ip_hash, ua_hash, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      userId,
      event,
      peppered(ipAddress),
      peppered(userAgent),
      metadata ? JSON.stringify(metadata) : null,
    ],
  );
};

export const auth = betterAuth({
  database: pool,
  baseURL: env.APP_URL,
  secret: env.AUTH_COOKIE_SECRET,
  trustedOrigins: env.TRUSTED_ORIGINS,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: env.REQUIRE_EMAIL_VERIFICATION,
    minPasswordLength: 8,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url, userLocale(user));
    },
    onPasswordReset: async ({ user }) => {
      // Invalidate all sessions: force re-login on every device.
      await pool.query(`DELETE FROM session WHERE user_id = $1`, [user.id]);
      await recordAuthEvent("password_reset", user.id, null, null);
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url, userLocale(user));
    },
  },

  socialProviders: {
    google: env.GOOGLE_CLIENT_ID
      ? {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
        }
      : undefined,
    apple: env.APPLE_CLIENT_ID
      ? {
          clientId: env.APPLE_CLIENT_ID,
          clientSecret: env.APPLE_CLIENT_SECRET ?? "",
        }
      : undefined,
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"], // never apple — relay emails
      allowDifferentEmails: false,
    },
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  user: {
    modelName: "users",
    fields: {
      name: "full_name",
      image: "avatar_url",
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      preferredLanguage: {
        type: "string",
        defaultValue: "en",
        required: false,
        fieldName: "preferred_language",
      },
      preferredCurrency: {
        type: "string",
        required: false,
        fieldName: "preferred_currency",
      },
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        fieldName: "role",
      },
      accountType: {
        type: "string",
        defaultValue: "couple",
        required: false,
        fieldName: "account_type",
      },
      planTier: {
        type: "string",
        required: false,
        fieldName: "plan_tier",
      },
      planPurchasedAt: {
        type: "date",
        required: false,
        fieldName: "plan_purchased_at",
      },
      messageLimit: {
        type: "number",
        required: false,
        fieldName: "message_limit",
      },
      storageExpiresAt: {
        type: "date",
        required: false,
        fieldName: "storage_expires_at",
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: { enabled: false },
    // Account linking and password change require the session to have
    // re-authenticated within the last 5 minutes.
    freshAge: 5 * 60,
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      csrfToken: { type: "string", required: true, fieldName: "csrf_token" },
      lastUsedAt: { type: "date", required: true, fieldName: "last_used_at" },
      freshAuthAt: { type: "date", required: true, fieldName: "fresh_auth_at" },
      lastIpHash: {
        type: "string",
        required: false,
        fieldName: "last_ip_hash",
      },
      lastUaHash: {
        type: "string",
        required: false,
        fieldName: "last_ua_hash",
      },
      riskScore: { type: "number", required: true, fieldName: "risk_score" },
    },
  },

  rateLimit: {
    enabled: env.IS_PRODUCTION,
    storage: "database",
    modelName: "rate_limit",
    window: 60,
    max: 30,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 600, max: 3 },
      "/forget-password": { window: 600, max: 2 },
      "/request-password-reset": { window: 600, max: 2 },
      "/reset-password": { window: 600, max: 5 },
      "/sign-in/social": { window: 60, max: 10 },
      "/callback/google": { window: 60, max: 10 },
      "/callback/apple": { window: 60, max: 10 },
      "/send-verification-email": { window: 600, max: 3 },
    },
  },

  databaseHooks: {
    session: {
      create: {
        before: async (sessionRecord) => {
          const { rows: userRows } = await pool.query<{
            deleted_at: Date | null;
          }>(`SELECT deleted_at FROM users WHERE id = $1`, [
            sessionRecord.userId,
          ]);
          if (userRows[0]?.deleted_at) {
            throw new APIError("FORBIDDEN", {
              message: ACCOUNT_DELETED_MESSAGE,
              code: ACCOUNT_DELETED_ERROR_CODE,
            });
          }
          await enforceSessionCap(sessionRecord.userId);
          const csrfToken = randomBytes(32).toString("hex");
          const ipHash = peppered(sessionRecord.ipAddress);
          const uaHash = peppered(sessionRecord.userAgent);
          const now = new Date();
          return {
            data: {
              ...sessionRecord,
              csrfToken,
              lastUsedAt: now,
              freshAuthAt: now,
              lastIpHash: ipHash,
              lastUaHash: uaHash,
              riskScore: 0,
            },
          };
        },
        after: async (sessionRecord) => {
          await recordAuthEvent(
            "session_create",
            sessionRecord.userId,
            sessionRecord.ipAddress ?? null,
            sessionRecord.userAgent ?? null,
          );
        },
      },
      delete: {
        after: async (sessionRecord) => {
          await recordAuthEvent(
            "session_revoke",
            sessionRecord.userId,
            sessionRecord.ipAddress ?? null,
            sessionRecord.userAgent ?? null,
          );
        },
      },
    },
    account: {
      create: {
        after: async (accountRecord) => {
          if (accountRecord.providerId !== "credential") {
            await recordAuthEvent(
              "oauth_link",
              accountRecord.userId,
              null,
              null,
              { provider: accountRecord.providerId },
            );
          }
        },
      },
    },
    user: {
      create: {
        before: async (userRecord, ctx) => {
          const incoming = userRecord as { preferredLanguage?: string | null };
          const alreadySet =
            typeof incoming.preferredLanguage === "string" &&
            isSupportedLocale(incoming.preferredLanguage);
          if (alreadySet) return { data: userRecord };
          const fromRequest = parseSignupLocale(ctx?.request);
          if (!fromRequest) return { data: userRecord };
          return {
            data: { ...userRecord, preferredLanguage: fromRequest },
          };
        },
        after: async (userRecord, ctx) => {
          await recordAuthEvent("login_success", userRecord.id, null, null, {
            firstSignIn: true,
          });
          const refCode = parseSignupReferralCode(ctx?.request);
          if (!refCode) return;
          try {
            const referrerId = await resolveReferrerIdByCode(refCode);
            if (referrerId && referrerId !== userRecord.id) {
              await recordReferralAttribution(referrerId, userRecord.id);
            }
          } catch {
            // Attribution is best-effort — never block signup on a failure.
          }
        },
      },
    },
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
    cookiePrefix: "ovation",
    useSecureCookies: env.IS_PRODUCTION,
    crossSubDomainCookies: env.COOKIE_DOMAIN
      ? { enabled: true, domain: env.COOKIE_DOMAIN }
      : { enabled: false },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: env.IS_PRODUCTION,
      httpOnly: true,
    },
  },

  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;

// Risk threshold for advisory consumers (sessions UI warning, etc.)
export { RISK_LOCKOUT_THRESHOLD };
