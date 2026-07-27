import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import type { LocalePageProps } from "@/i18n/types";

const PROMO_PATTERN = /^[A-Z0-9_-]{2,40}$/;

const normalize = (raw: string | undefined): string | null => {
  if (!raw) return null;
  const trimmed = raw.trim().toUpperCase();
  return PROMO_PATTERN.test(trimmed) ? trimmed : null;
};

type RedeemRouteProps = LocalePageProps & {
  searchParams: Promise<Record<string, string | undefined>>;
};

export const RedeemRoute = async ({
  params,
  searchParams,
}: RedeemRouteProps) => {
  const [{ locale }, { promo }] = await Promise.all([params, searchParams]);
  const code = normalize(promo);
  const promoQs = code ? `?promo=${encodeURIComponent(code)}` : "";

  const target = `${appRoutes.auth.plans}${promoQs}`;
  const user = await getCurrentUser();

  if (user) {
    redirect({ href: target, locale });
  }

  const signInHref = `${appRoutes.auth.signIn}?redirect=${encodeURIComponent(
    target,
  )}${code ? `&promo=${encodeURIComponent(code)}` : ""}`;

  redirect({ href: signInHref, locale });
};
