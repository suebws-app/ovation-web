import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { SignupThemeScope } from "@/components/SignupThemeScope";
import { AuthLayout } from "@/features/layout/AuthLayout/AuthLayout";
import { loadShellMessages } from "@/i18n/loadMessages";
import type { LocalePageProps } from "@/i18n/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false } };

const AuthGroupLayout = async ({
  children,
  params,
}: { children: React.ReactNode } & LocalePageProps) => {
  const { locale } = await params;
  const messages = await loadShellMessages(locale, ["auth", "signup"]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SignupThemeScope />
      <AuthLayout>{children}</AuthLayout>
    </NextIntlClientProvider>
  );
};

export default AuthGroupLayout;
