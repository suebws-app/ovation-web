import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { Rubik, Noto_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/features/layout/AppProviders";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const themeScript = `(function(){
  try {
    var d = document.documentElement;
    var t = JSON.parse(localStorage.getItem('theme') || '{}');
    var v = t && t.state && t.state.theme;
    if (v === 'dark') {
      d.classList.add('dark');
    }
  } catch(e) {}
})()`;

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

  return (
    <html lang={locale} className={`${rubik.variable} ${notoSans.variable} h-dvh antialiased`} suppressHydrationWarning>
      <body className="font-sans flex max-h-dvh flex-1 flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
