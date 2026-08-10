import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { RootHeader } from "@/features/layout/RootHeader";
import { RootFooter } from "@/features/layout/RootFooter";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, webSiteSchema } from "@/lib/seo/schemas";
import { ReferralCapture } from "@/features/marketing/components/ReferralCapture";
import { loadShellMessages } from "@/i18n/loadMessages";
import type { LocalePageProps } from "@/i18n/types";

const MarketingLayout = async ({
  children,
  params,
}: { children: React.ReactNode } & LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await loadShellMessages(locale, ["marketing"]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <RootHeader />
      <main className="flex-1">{children}</main>
      <RootFooter />
    </NextIntlClientProvider>
  );
};

export default MarketingLayout;
