"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { Separator } from "@ovation/ui/components/Separator";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Logo } from "@ovation/ui/components/Logo";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { SocialAuthButtons } from "../../components/SocialAuthButtons";
import { Link, useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import { env } from "@/lib/utils/env";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { getSignInSchema, type SignInFields } from "../signInSchema";
import { UnverifiedEmailBanner } from "../components/UnverifiedEmailBanner";

const SIGNIN_FAIL_COOKIE = "ovation_signin_fails";
const SIGNIN_FAIL_THRESHOLD = 3;

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
    const redirectTo =
      raw.startsWith("/") && !raw.startsWith("//") ? raw : appRoutes.app.root;
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <div className="tablet:px-20 tablet:py-12 tablet:gap-4 tablet:h-auto tablet:overflow-visible flex h-full flex-col items-center gap-2 overflow-y-auto px-5 py-4">
      <Logo className="self-start" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full flex-1 flex-col justify-center"
        style={{ maxWidth: 440 }}
      >
        <Kicker className="text-primary tablet:mb-2.5 mb-1.5">
          {t("auth__signin__eyebrow")}
        </Kicker>
        <h1 className="type-h1 tablet:type-display leading-[1.05] font-semibold tracking-tight">
          {t("auth__signin__title")}
          <br />
          <span className="text-primary italic">
            {t("auth__signin__title_emphasis")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground tablet:mt-3.5 mt-2 leading-relaxed">
          {t("auth__signin__subtitle")}
        </p>

        <SocialAuthButtons action="sign-in" className="tablet:mt-9 mt-4" />

        <Separator label={t("auth__signin__separator")} className="tablet:my-6 my-3" />

        <div className="tablet:space-y-4.5 space-y-3">
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

        {submitError && (
          <p className="type-body-small text-destructive mt-4" role="alert">
            {submitError}
          </p>
        )}

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

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="shadow-primary/40 tablet:mt-6 mt-4 w-full rounded-full shadow-md"
        >
          {isSubmitting
            ? t("auth__signin__submit_pending")
            : t("auth__signin__submit")}
          <ArrowRightIcon width={16} height={16} />
        </Button>

        <p className="type-body-small text-muted-foreground tablet:mt-4.5 mt-3 text-center">
          {t("auth__signin__no_account")}{" "}
          <Link
            href={appRoutes.auth.role}
            className="text-foreground font-semibold"
          >
            {t("auth__signin__signup_short")}
          </Link>
        </p>
      </form>

      <p className="type-caption text-muted-foreground/60 self-start">
        {t("auth__signin__protected")}
      </p>
    </div>
  );
};
