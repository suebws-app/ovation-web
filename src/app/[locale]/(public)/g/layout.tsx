import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { loadShellMessages } from "@/i18n/loadMessages";
import type { LocalePageProps } from "@/i18n/types";
import { ApiPreconnect } from "@/components/ApiPreconnect";

export const metadata: Metadata = { robots: { index: false } };

const GuestLayout = async ({
  children,
  params,
}: { children: React.ReactNode } & LocalePageProps) => {
  const { locale } = await params;
  const messages = await loadShellMessages(locale, ["guest", "eventTypes"]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ApiPreconnect />
      <main className="flex-1">{children}</main>
    </NextIntlClientProvider>
  );
};

export default GuestLayout;
