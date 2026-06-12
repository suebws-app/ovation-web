"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { clientEnv as env } from "@/lib/utils/env.client";
import { AuthScreen } from "./components/AuthScreen";
import { AuthHeading } from "./components/AuthHeading";
import { AuthFormError } from "./components/AuthFormError";
import { AuthSubmitButton } from "./components/AuthSubmitButton";
import { AuthFooterLink } from "./components/AuthFooterLink";
import {
  getForgotPasswordSchema,
  type ForgotPasswordFields,
} from "./forgotPasswordSchema";

type Status =
  | { kind: "idle" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

export const ForgotPasswordForm = () => {
  const t = useTranslations();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const schema = useMemo(() => getForgotPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFields>({
    defaultValues: { email: "" },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordFields) => {
    setStatus({ kind: "idle" });
    if (env.TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus({ kind: "error", message: t("auth__forgot__error_turnstile") });
      return;
    }
    const requestPasswordReset = authClient.requestPasswordReset as (
      opts: { email: string; redirectTo: string },
      fetchOptions?: { headers?: Record<string, string> },
    ) => Promise<{ error?: { message?: string; code?: string } | null }>;
    const { error } = await requestPasswordReset(
      {
        email: values.email,
        redirectTo: appRoutes.auth.resetPassword,
      },
      turnstileToken
        ? { headers: { "x-turnstile-token": turnstileToken } }
        : undefined,
    );
    if (error) {
      setStatus({ kind: "sent", email: values.email });
      return;
    }
    setStatus({ kind: "sent", email: values.email });
  };

  return (
    <AuthScreen>
      <AuthHeading
        eyebrow={t("auth__forgot__eyebrow")}
        title={t("auth__forgot__title")}
        titleEmphasis={t("auth__forgot__title_emphasis")}
        subtitle={t("auth__forgot__subtitle")}
      />

      {status.kind === "sent" ? (
        <div className="rounded-12 border-border bg-muted/40 tablet:mt-6 mt-4 border p-6">
          <p className="type-body-small text-foreground">
            {t.rich("auth__forgot__sent_card", {
              email: () => <strong>{status.email}</strong>,
            })}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="tablet:mt-6 mt-4 w-full"
        >
          <div>
            <Label htmlFor="forgot-email" className="mb-2">
              {t("auth__email")}
            </Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder={t("auth__forgot__email_placeholder")}
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <p className="type-caption text-destructive mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {status.kind === "error" && (
            <AuthFormError message={status.message} />
          )}

          <div className="mt-6">
            <TurnstileWidget
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>

          <AuthSubmitButton
            pending={isSubmitting}
            label={t("auth__forgot__submit")}
            pendingLabel={t("auth__forgot__sending")}
          />
        </form>
      )}

      <AuthFooterLink
        prompt={t("auth__forgot__remembered")}
        href={appRoutes.auth.signIn}
        linkLabel={t("auth__forgot__back_signin")}
      />
    </AuthScreen>
  );
};
