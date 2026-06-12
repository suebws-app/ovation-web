"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { authClient } from "@/lib/auth/client";
import { AuthScreen } from "./components/AuthScreen";
import { AuthHeading } from "./components/AuthHeading";
import { AuthFormError } from "./components/AuthFormError";
import { AuthSubmitButton } from "./components/AuthSubmitButton";
import { AuthFooterLink } from "./components/AuthFooterLink";
import {
  getResetPasswordSchema,
  type ResetPasswordFields,
} from "./resetPasswordSchema";

export const ResetPasswordForm = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken =
    searchParams.get("access_token") ?? searchParams.get("token") ?? "";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => getResetPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFields>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: ResetPasswordFields) => {
    setSubmitError(null);
    if (!accessToken) {
      setSubmitError(t("auth__reset__missing_token"));
      return;
    }
    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token: accessToken,
    });
    if (error) {
      setSubmitError(error.message ?? t("auth__reset__error_generic"));
      return;
    }
    router.replace(`${appRoutes.auth.signIn}?reset=ok`);
  };

  return (
    <AuthScreen>
      <AuthHeading
        eyebrow={t("auth__reset__eyebrow")}
        title={t("auth__reset__title")}
        titleEmphasis={t("auth__reset__title_emphasis")}
        subtitle={t("auth__reset__subtitle")}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="tablet:mt-6 mt-4 w-full"
      >
        <div className="tablet:space-y-4.5 space-y-3">
          <div>
            <Label htmlFor="new-password" className="mb-2">
              {t("auth__reset__new_password_label")}
            </Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder={t("auth__reset__new_password_placeholder")}
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="type-caption text-destructive mt-1.5">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirm-password" className="mb-2">
              {t("auth__reset__confirm_password_label")}
            </Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder={t("auth__reset__confirm_password_placeholder")}
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="type-caption text-destructive mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {submitError && <AuthFormError message={submitError} />}

        <AuthSubmitButton
          pending={isSubmitting}
          label={t("auth__reset__submit")}
          pendingLabel={t("auth__reset__saving")}
        />
      </form>

      <AuthFooterLink
        href={appRoutes.auth.signIn}
        linkLabel={t("auth__reset__back_signin")}
      />
    </AuthScreen>
  );
};
