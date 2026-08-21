import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { loadShellMessages } from "@/i18n/loadMessages";
import type { LocalePageProps } from "@/i18n/types";

export const metadata: Metadata = { robots: { index: false } };

const KioskLayout = async ({
  children,
  params,
}: { children: React.ReactNode } & LocalePageProps) => {
  const { locale } = await params;
  const messages = await loadShellMessages(locale, ["kiosk", "eventTypes"]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="bg-background fixed inset-0 overflow-hidden">
        {children}
      </div>
    </NextIntlClientProvider>
  );
};

export default KioskLayout;
