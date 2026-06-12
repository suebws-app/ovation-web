"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { Separator } from "@ovation/ui/components/Separator";
import { SocialAuthButtons } from "../../components/SocialAuthButtons";
import { AuthScreen } from "../../components/AuthScreen";
import { AuthHeading } from "../../components/AuthHeading";
import { AuthFormError } from "../../components/AuthFormError";
import { AuthSubmitButton } from "../../components/AuthSubmitButton";
import { AuthFooterLink } from "../../components/AuthFooterLink";
import { Link, useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import { clientEnv as env } from "@/lib/utils/env.client";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { getSignInSchema, type SignInFields } from "../signInSchema";
import { UnverifiedEmailBanner } from "../components/UnverifiedEmailBanner";

const SIGNIN_FAIL_COOKIE = "ovation_signin_fails";
const SIGNIN_FAIL_THRESHOLD = 3;

const ALLOWED_REDIRECT_PREFIXES = [
  "/home",
  "/messages",
  "/events",
  "/guests",
  "/photos",
  "/keepsakes",
  "/orders",
  "/cart",
  "/kiosk",
  "/link",
  "/help",
  "/account",
  "/qr-code",
  "/settings",
  "/verify",
  "/plans",
  "/checkout",
];

const isSafeInternalRedirect = (raw: string): boolean => {
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return false;
  }
  let resolved: string;
  try {
    resolved = new URL(raw, "https://placeholder.local").pathname;
  } catch {
    return false;
  }
  if (resolved !== raw.split("?")[0].split("#")[0]) return false;
  return ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) => resolved === prefix || resolved.startsWith(`${prefix}/`),
  );
};

const readFailCount = (): number => {
  if (typeof document === "undefined") return 0;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${SIGNIN_FAIL_COOKIE}=(\\d+)`),
  );
  return match ? Number(match[1]) : 0;
};

type SignInFormProps = {
  initialFailCount: number;
};

export const SignInForm = ({ initialFailCount }: SignInFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [failCount, setFailCount] = useState(initialFailCount);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const schema = useMemo(() => getSignInSchema(t), [t]);

  const turnstileRequired =
    Boolean(env.TURNSTILE_SITE_KEY) && failCount >= SIGNIN_FAIL_THRESHOLD;

  const urlErrorParam = searchParams.get("error") ?? "";
  const urlAccountDeletedError =
    urlErrorParam === "ACCOUNT_DELETED" ||
    urlErrorParam.includes("ACCOUNT_DELETED")
      ? t("auth__signin__error_account_deleted")
      : null;
  const displayError = submitError ?? urlAccountDeletedError;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFields>({
    defaultValues: { email: "", password: "", keepSignedIn: true },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: SignInFields) => {
    setSubmitError(null);
    setUnverifiedEmail(null);

    if (turnstileRequired && !turnstileToken) {
      setSubmitError(t("auth__signin__error_turnstile"));
      return;
    }

    const signInEmail = authClient.signIn.email as (
      opts: { email: string; password: string },
      fetchOptions?: { headers?: Record<string, string> },
    ) => Promise<{
      error?: { message?: string; code?: string } | null;
    }>;

    const { error } = await signInEmail(
      { email: values.email, password: values.password },
      turnstileToken
        ? { headers: { "x-turnstile-token": turnstileToken } }
        : undefined,
    );
    if (error) {
      setFailCount(readFailCount());
      setTurnstileToken(null);
      setTurnstileResetKey((k) => k + 1);
      const errorCode =
        ((error as Record<string, unknown>)?.code as string | undefined) ?? "";
      if (errorCode === "ACCOUNT_DELETED") {
        setSubmitError(t("auth__signin__error_account_deleted"));
        return;
      }
      const isUnverified =
        errorCode.toUpperCase().includes("EMAIL") &&
        errorCode.toUpperCase().includes("VERIF");
      if (isUnverified) {
        setUnverifiedEmail(values.email);
        return;
      }
      setSubmitError(error.message ?? t("auth__signin__error_generic"));
      return;
    }
    const raw = searchParams.get("redirect") ?? "";
    const redirectTo = isSafeInternalRedirect(raw) ? raw : appRoutes.app.root;
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <AuthScreen footnote={t("auth__signin__protected")}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
        <AuthHeading
          eyebrow={t("auth__signin__eyebrow")}
          title={t("auth__signin__title")}
          titleEmphasis={t("auth__signin__title_emphasis")}
        />
        <div className="tablet:space-y-4.5 mt-4 space-y-3">
          <div>
            <Label htmlFor="signin-email" className="mb-2">
              {t("auth__email")}
            </Label>
            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder={t("auth__signin__email_placeholder")}
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <p className="type-caption text-destructive mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="signin-password" className="mb-2">
              {t("auth__password")}
            </Label>
            <Input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              placeholder={t("auth__signin__password_placeholder")}
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && (
              <p className="type-caption text-destructive mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Controller
            control={control}
            name="keepSignedIn"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                label={t("auth__signin__keep_signed_in")}
              />
            )}
          />
          <Link
            href={appRoutes.auth.forgotPassword}
            className="type-body-small text-primary font-semibold"
          >
            {t("auth__forgot_password")}
          </Link>
        </div>

        {displayError && <AuthFormError message={displayError} />}

        {unverifiedEmail && (
          <UnverifiedEmailBanner
            email={unverifiedEmail}
            onSent={() => setUnverifiedEmail(null)}
          />
        )}

        {turnstileRequired && (
          <div className="mt-6">
            <TurnstileWidget
              resetKey={turnstileResetKey}
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
        )}

        <AuthSubmitButton
          pending={isSubmitting}
          label={t("auth__signin__submit")}
          pendingLabel={t("auth__signin__submit_pending")}
        />

        <Separator
          label={t("auth__signin__separator")}
          className="tablet:my-6 my-3"
        />

        <SocialAuthButtons />

        <AuthFooterLink
          prompt={t("auth__signin__no_account")}
          href={appRoutes.auth.role}
          linkLabel={t("auth__signin__signup_short")}
        />
      </form>
    </AuthScreen>
  );
};
