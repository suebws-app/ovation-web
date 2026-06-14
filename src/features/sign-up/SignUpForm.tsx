"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { Separator } from "@ovation/ui/components/Separator";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { AuthScreen } from "@/features/auth/components/AuthScreen";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { AuthFormError } from "@/features/auth/components/AuthFormError";
import { AuthSubmitButton } from "@/features/auth/components/AuthSubmitButton";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import {
  getSignUpSchema,
  type SignUpFields,
} from "@/features/sign-up/signUpSchema";
import { useCreateAccount } from "@/features/sign-up/hooks/useCreateAccount";

export const SignUpForm = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const storedEmail = useSignUpStore((s) => s.formData.email);
  const storedAgreed = useSignUpStore((s) => s.formData.agreedToTerms);
  const schema = useMemo(() => getSignUpSchema(t), [t]);

  const { onSubmit, submitError, setTurnstileToken, turnstileResetKey } =
    useCreateAccount();

  useEffect(() => {
    const as = searchParams.get("as");
    const plan = searchParams.get("plan");
    if (as === "pro") updateFormData({ accountType: "pro" });
    else if (as === "couple") updateFormData({ accountType: "couple" });
    if (plan) updateFormData({ selectedPlan: plan });
  }, [searchParams, updateFormData]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFields>({
    defaultValues: {
      email: storedEmail,
      password: "",
      agreedToTerms: storedAgreed,
    },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  return (
    <AuthScreen>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
        <AuthHeading
          eyebrow={t("auth__signup__create_account__label")}
          title={t("auth__signup__create_account__title")}
          titleEmphasis={t("auth__signup__create_account__title_emphasis")}
        />
        <div className="tablet:space-y-4.5 mt-4 space-y-3">
          <div>
            <Label htmlFor="signup-email" className="mb-2">
              {t("auth__signup__create_account__email_label")}
            </Label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder={t("auth__signup__create_account__email_placeholder")}
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
            <Label htmlFor="signup-password" className="mb-2">
              {t("auth__signup__create_account__password_label")}
            </Label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder={t(
                "auth__signup__create_account__password_placeholder",
              )}
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password ? (
              <p className="type-caption text-destructive mt-1.5">
                {errors.password.message}
              </p>
            ) : (
              <p className="type-caption text-muted-foreground mt-1.5">
                {t("auth__signup__create_account__password_hint")}
              </p>
            )}
          </div>
        </div>

        <Controller
          control={control}
          name="agreedToTerms"
          render={({ field, fieldState }) => (
            <div className="mt-3">
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                label={
                  <span>
                    {t.rich("auth__signup__create_account__terms_label", {
                      privacy: (chunks) => (
                        <Link
                          href={appRoutes.legal.privacy}
                          className="text-primary font-semibold"
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </span>
                }
              />
              {fieldState.error && (
                <p className="type-caption text-destructive mt-1.5">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {submitError && <AuthFormError message={submitError} />}

        <div className="mt-6">
          <TurnstileWidget
            resetKey={turnstileResetKey}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
          />
        </div>

        <AuthSubmitButton
          pending={isSubmitting}
          label={t("auth__signup__create_account__submit")}
          pendingLabel={t("auth__signup__create_account__submit_pending")}
        />

        <Separator
          label={t("auth__signup__create_account__separator")}
          className="tablet:my-6 my-3"
        />

        <SocialAuthButtons />

        <AuthFooterLink
          prompt={t("auth__signup__create_account__has_account")}
          href={appRoutes.auth.signIn}
          linkLabel={t("auth__signup__create_account__signin_cta")}
        />
      </form>
    </AuthScreen>
  );
};
