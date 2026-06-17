"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter as useNextRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter as useIntlRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Combobox } from "@ovation/ui/components/Combobox";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import { locales, type Locale } from "@/i18n/config";
import { formatNativeLanguageName } from "@/lib/utils/localeFormatters";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  type Currency,
} from "@/i18n/currency-config";
import { setCookie } from "@/lib/utils/cookies";

const COOKIE_MAX_AGE_ONE_YEAR = 31536000;
type LocalizationFormProps = {
  user: User;
};

type SelectFieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

const SelectField = ({ label, hint, children }: SelectFieldProps) => (
  <div className="block">
    <span className="type-caption text-muted-foreground mb-2 block font-semibold tracking-wide">
      {label}
    </span>
    {children}
    {hint && (
      <span className="type-caption text-muted-foreground mt-1.5 block leading-relaxed">
        {hint}
      </span>
    )}
  </div>
);

type Status =
  | { kind: "idle" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

type LocalizationFields = {
  preferredLanguage: Locale;
  preferredCurrency: Currency;
};

const setLocalizationCookies = (language: Locale, currency: Currency) => {
  setCookie("NEXT_LOCALE", language, { maxAge: COOKIE_MAX_AGE_ONE_YEAR });
  setCookie(CURRENCY_COOKIE, currency, { maxAge: COOKIE_MAX_AGE_ONE_YEAR });
};

export const LocalizationForm = ({ user }: LocalizationFormProps) => {
  const t = useTranslations();
  const nextRouter = useNextRouter();
  const intlRouter = useIntlRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const initialLanguage: Locale = locales.includes(user.preferredLanguage)
    ? user.preferredLanguage
    : (locales[0] ?? "en");
  const initialCurrency: Currency = user.preferredCurrency ?? DEFAULT_CURRENCY;

  const languageOptions = locales.map((code) => ({
    value: code,
    label: formatNativeLanguageName(code),
  }));
  const currencyOptions = SUPPORTED_CURRENCIES.map((code) => ({
    value: code,
    label: code,
  }));

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
  } = useForm<LocalizationFields>({
    defaultValues: {
      preferredLanguage: initialLanguage,
      preferredCurrency: initialCurrency,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: LocalizationFields) => {
    setStatus({ kind: "idle" });
    try {
      const { user: updated } = await profileClient.updateProfile({
        preferredLanguage: values.preferredLanguage,
        preferredCurrency: values.preferredCurrency,
      });
      setLocalizationCookies(
        values.preferredLanguage,
        values.preferredCurrency,
      );
      reset({
        preferredLanguage: updated.preferredLanguage,
        preferredCurrency: updated.preferredCurrency ?? DEFAULT_CURRENCY,
      });
      setStatus({ kind: "saved" });
      const languageChanged = values.preferredLanguage !== initialLanguage;
      if (languageChanged) {
        intlRouter.replace(pathname, { locale: values.preferredLanguage });
      } else {
        nextRouter.refresh();
      }
    } catch (error) {
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error)
          ? error.message
          : t("settings__profile__save_error"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
        <SelectField
          label={t("settings__profile__language_label")}
          hint={t("settings__profile__language_hint")}
        >
          <Controller
            control={control}
            name="preferredLanguage"
            render={({ field }) => (
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                options={languageOptions}
                ariaLabel={t("settings__profile__language_label")}
                search
                searchPlaceholder={t(
                  "settings__profile__language_search_placeholder",
                )}
                emptyMessage={t("settings__profile__language_empty")}
              />
            )}
          />
        </SelectField>
        <SelectField
          label={t("settings__profile__currency_label")}
          hint={t("settings__profile__currency_hint")}
        >
          <Controller
            control={control}
            name="preferredCurrency"
            render={({ field }) => (
              <Combobox
                value={field.value}
                onValueChange={field.onChange}
                options={currencyOptions}
                ariaLabel={t("settings__profile__currency_label")}
                search
                searchPlaceholder={t(
                  "settings__profile__currency_search_placeholder",
                )}
                emptyMessage={t("settings__profile__currency_empty")}
              />
            )}
          />
        </SelectField>
      </div>

      {status.kind === "error" && (
        <p className="type-body-small text-destructive mt-4" role="alert">
          {status.message}
        </p>
      )}
      {status.kind === "saved" && (
        <p className="type-body-small text-secondary mt-4">
          {t("settings__profile__saved")}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2.5">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="rounded-full"
        >
          {isSubmitting
            ? t("settings__profile__saving")
            : t("settings__profile__save")}
        </Button>
      </div>
    </form>
  );
};
