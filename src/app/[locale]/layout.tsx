import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/features/layout/AppProviders";

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const themeScript = `(function(){
  try {
    var d = document.documentElement;
    var t = JSON.parse(localStorage.getItem('theme') || '{}');
    var v = t && t.state && t.state.theme;
    if (v === 'dark' || (v !== 'light' && matchMedia('(prefers-color-scheme:dark)').matches)) {
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
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
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
