import { Rubik, Noto_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/features/layout/AppProviders";
import { Toaster } from "@/components/Toaster";
import { NavigationProgress } from "@/components/NavigationProgress";
import { ThemeInitScript } from "@/components/ThemeInitScript";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "optional",
  adjustFontFallback: true,
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "optional",
  adjustFontFallback: true,
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

  const messages = await getMessages();
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("ovation_theme")?.value;
  const initialDarkClass = themeCookie === "dark" ? " dark" : "";

  return (
    <html
      lang={locale}
      className={`${rubik.variable} ${notoSans.variable} h-dvh antialiased${initialDarkClass}`}
      suppressHydrationWarning
    >
      <body className="flex max-h-dvh flex-1 flex-col font-sans">
        <ThemeInitScript />
        <NextIntlClientProvider messages={messages}>
          <NavigationProgress />
          <AppProviders>{children}</AppProviders>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
