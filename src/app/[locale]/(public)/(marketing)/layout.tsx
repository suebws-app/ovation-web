import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { RootHeader } from "@/features/layout/RootHeader";
import { RootFooter } from "@/features/layout/RootFooter";
import { PromoBar } from "@/features/layout/PromoBar";
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
      {/* Third-party origins Lighthouse flags as critical-path on marketing:
          Cloudflare Insights beacon (auto-injected when proxied through CF)
          and Vercel Analytics/Speed Insights scripts. Preconnect saves
          ~150-300ms on the LCP path. */}
      <link rel="preconnect" href="https://static.cloudflareinsights.com" />
      <link rel="preconnect" href="https://va.vercel-scripts.com" />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <div className="sticky top-0 z-50">
        <PromoBar />
        <RootHeader sticky={false} />
      </div>
      <main className="flex-1">{children}</main>
      <RootFooter />
    </NextIntlClientProvider>
  );
};

export default MarketingLayout;
