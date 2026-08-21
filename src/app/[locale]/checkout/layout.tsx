import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { SignupThemeScope } from "@/components/SignupThemeScope";
import { LogoHeader } from "@/components/LogoHeader";
import { ApiPreconnect } from "@/components/ApiPreconnect";
import { loadShellMessages } from "@/i18n/loadMessages";
import type { LocalePageProps } from "@/i18n/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false } };

const CheckoutLayout = async ({
  children,
  params,
}: { children: React.ReactNode } & LocalePageProps) => {
  const { locale } = await params;
  const messages = await loadShellMessages(locale, [
    "checkout",
    "signup",
    "plans",
    "cart",
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ApiPreconnect />
      <SignupThemeScope />
      <div className="flex min-h-screen w-full flex-col">
        <LogoHeader />
        <main className="mx-auto flex w-full max-w-160 flex-1 flex-col justify-center gap-6 px-6 py-10">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
};

export default CheckoutLayout;
