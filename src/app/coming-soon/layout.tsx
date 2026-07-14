import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { GoogleTagManagerNoscript } from "@/components/GoogleTagManagerNoscript";
import "@/app/globals.css";

export const metadata: Metadata = { robots: { index: false } };

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "optional",
  adjustFontFallback: true,
});

const ComingSoonLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const messages = await getMessages();

  return (
    <html lang="en" className={`${rubik.variable} antialiased`}>
      <body className="font-sans">
        <GoogleTagManagerNoscript />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default ComingSoonLayout;
