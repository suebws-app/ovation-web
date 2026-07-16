import { Rubik, Noto_Sans } from "next/font/google";
import localFont from "next/font/local";
import { cookies, headers } from "next/headers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { loadPublicShellMessages } from "@/i18n/loadMessages";
import { AppProviders } from "@/features/layout/AppProviders";
import { Toaster } from "@/components/Toaster";
import { NavigationProgress } from "@/components/NavigationProgress";
import { THEME_INIT_SNIPPET } from "@/components/ThemeInitScript";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
  adjustFontFallback: true,
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  adjustFontFallback: true,
});
const snellRoundhand = localFont({
  src: "./fonts/snell-roundhand-regular.woff2",
  variable: "--font-snell",
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

  const publicShellMessages = await loadPublicShellMessages(locale);
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("ovation_theme")?.value;
  const initialDarkClass = themeCookie === "dark" ? " dark" : "";
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang={locale}
      className={`${rubik.variable} ${notoSans.variable} ${snellRoundhand.variable} h-dvh antialiased${initialDarkClass}`}
      suppressHydrationWarning
    >
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SNIPPET }}
        />
      </head>
      <body className="flex max-h-dvh flex-1 flex-col font-sans">
        <NextIntlClientProvider messages={publicShellMessages}>
          <NavigationProgress />
          <AppProviders>{children}</AppProviders>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
