"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { Separator } from "@ovation/ui/components/Separator";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { getSignUpSchema, type SignUpFields } from "@/features/sign-up/signUpSchema";
import { useCreateAccount } from "@/features/sign-up/hooks/useCreateAccount";

export const SignUpForm = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const storedEmail = useSignUpStore((s) => s.formData.email);
  const storedAgreed = useSignUpStore((s) => s.formData.agreedToTerms);
  const schema = useMemo(() => getSignUpSchema(t), [t]);

  const { onSubmit, submitError, setTurnstileToken } = useCreateAccount();

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Kicker className="text-primary mb-3">
        {t("auth__signup__eyebrow_step", {
          step: 3,
          label: t("auth__signup__create_account__label"),
        })}
      </Kicker>
      <h1 className="type-h1 leading-tight font-semibold tracking-tight">
        {t("auth__signup__create_account__title")}
        <br />
        <span className="text-primary italic">
          {t("auth__signup__create_account__title_emphasis")}
        </span>
      </h1>
      <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
        {t("auth__signup__create_account__subtitle")}
      </p>

      <SocialAuthButtons action="sign-up" className="mt-8" />

      <Separator
        label={t("auth__signup__create_account__separator")}
        className="my-6"
      />

      <div className="space-y-5">
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
            placeholder={t("auth__signup__create_account__password_placeholder")}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password ? (
            <p className="type-caption text-destructive mt-1.5">
              {errors.password.message}
            </p>
          ) : (
            <p className="type-caption text-muted-foreground mt-2">
              {t("auth__signup__create_account__password_hint")}
            </p>
          )}
        </div>
      </div>

      <Controller
        control={control}
        name="agreedToTerms"
        render={({ field, fieldState }) => (
          <div className="mt-6">
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              label={
                <span>
                  {t.rich("auth__signup__create_account__terms_label", {
                    terms: (chunks) => (
                      <Link
                        href={appRoutes.legal.terms}
                        className="text-primary font-semibold"
                      >
                        {chunks}
                      </Link>
                    ),
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

      <div className="mt-6">
        <TurnstileWidget
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>

      {submitError && (
        <p className="type-body-small text-destructive mt-4" role="alert">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
      >
        {isSubmitting
          ? t("auth__signup__create_account__submit_pending")
          : t("auth__signup__create_account__submit")}
        <ArrowRightIcon width={16} height={16} />
      </Button>

      <p className="type-body-small text-muted-foreground mt-4.5 text-center">
        {t("auth__signup__create_account__has_account")}{" "}
        <Link href={appRoutes.auth.signIn} className="text-foreground font-semibold">
          {t("auth__signup__create_account__signin_cta")}
        </Link>
      </p>
    </form>
  );
};
