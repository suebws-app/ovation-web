import { Suspense } from "react";
import { Rubik, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { loadPublicShellMessages } from "@/i18n/loadMessages";
import { AppProviders } from "@/features/layout/AppProviders";
import { Toaster } from "@/components/Toaster";
import { NavigationProgress } from "@/components/NavigationProgress";
import { ThemeInitScript } from "@/components/ThemeInitScript";
import { GoogleTagManagerNoscript } from "@/components/GoogleTagManagerNoscript";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "optional",
  adjustFontFallback: true,
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const publicShellMessages = await loadPublicShellMessages(locale);

  return (
    <html
      lang={locale}
      className={`${rubik.variable} ${cormorant.variable} h-dvh antialiased`}
      suppressHydrationWarning
    >
      <body className="flex max-h-dvh flex-1 flex-col font-sans">
        <GoogleTagManagerNoscript />
        <ThemeInitScript />
        <NextIntlClientProvider locale={locale} messages={publicShellMessages}>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <AppProviders>{children}</AppProviders>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
