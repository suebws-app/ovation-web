import "server-only";
import { Resend } from "resend";
import { serverEnv as env } from "@/lib/utils/env.server";

/**
 * Auth emails (verification, password reset) are rendered and sent by the
 * API (branded templates + email_log auditing) via its internal endpoints,
 * authenticated with INTERNAL_API_SECRET. If the API is unreachable or the
 * secret is missing, we fall back to sending a minimal email directly via
 * Resend so sign-up and password reset never break.
 */

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

const sendDirect = async ({ to, subject, html }: SendArgs) => {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — email skipped", {
      to,
      subject,
    });
    return;
  }
  await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
};

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
) => {
  if (await sendViaApi("verification", { to, url, locale })) return;

  const subjects: Record<string, string> = {
    en: "Verify your email",
    fr: "Vérifiez votre adresse e-mail",
    nl: "Bevestig je e-mailadres",
    de: "Bestätige deine E-Mail-Adresse",
    es: "Verifica tu correo electrónico",
    it: "Verifica la tua email",
  };
  const cta: Record<string, string> = {
    en: "Verify email",
    fr: "Vérifier",
    nl: "Bevestigen",
    de: "Bestätigen",
    es: "Verificar",
    it: "Verifica",
  };
  const lang = subjects[locale] ? locale : "en";
  await sendDirect({
    to,
    subject: subjects[lang]!,
    html: `<p>${subjects[lang]}</p><p><a href="${url}" rel="noreferrer">${cta[lang]}</a></p><p>This link expires in 24 hours.</p>`,
  });
};

export const sendResetPasswordEmail = async (
  to: string,
  url: string,
  locale: string,
) => {
  if (await sendViaApi("password-reset", { to, url, locale })) return;

  const subjects: Record<string, string> = {
    en: "Reset your password",
    fr: "Réinitialisez votre mot de passe",
    nl: "Stel je wachtwoord opnieuw in",
    de: "Passwort zurücksetzen",
    es: "Restablece tu contraseña",
    it: "Reimposta la password",
  };
  const cta: Record<string, string> = {
    en: "Reset password",
    fr: "Réinitialiser",
    nl: "Opnieuw instellen",
    de: "Zurücksetzen",
    es: "Restablecer",
    it: "Reimposta",
  };
  const lang = subjects[locale] ? locale : "en";
  await sendDirect({
    to,
    subject: subjects[lang]!,
    html: `<p>${subjects[lang]}</p><p><a href="${url}" rel="noreferrer">${cta[lang]}</a></p><p>This link expires in 1 hour. If you didn't request this, ignore the email.</p>`,
  });
};
