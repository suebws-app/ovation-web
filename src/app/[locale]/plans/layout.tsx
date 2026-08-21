import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { SignupThemeScope } from "@/components/SignupThemeScope";
import { loadShellMessages } from "@/i18n/loadMessages";
import type { LocalePageProps } from "@/i18n/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false } };

const PlansLayout = async ({
  children,
  params,
}: { children: React.ReactNode } & LocalePageProps) => {
  const { locale } = await params;
  const messages = await loadShellMessages(locale, ["plans", "signup", "link"]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SignupThemeScope />
      {children}
    </NextIntlClientProvider>
  );
};

export default PlansLayout;
