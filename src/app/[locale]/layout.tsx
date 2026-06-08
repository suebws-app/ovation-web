import Script from "next/script";
import { Rubik, Noto_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/features/layout/AppProviders";

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
    <html
      lang={locale}
      className={`${rubik.variable} ${notoSans.variable} h-dvh antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      {process.env.NEXT_PUBLIC_COOKIE_YES_SITE_ID && (
        <Script
          id="cookieyes"
          src={`https://cdn-cookieyes.com/client_data/${process.env.NEXT_PUBLIC_COOKIE_YES_SITE_ID}/script.js`}
          strategy="beforeInteractive"
        />
      )}
      <body className="flex max-h-dvh flex-1 flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
