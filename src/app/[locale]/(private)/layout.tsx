import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false } };

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider>
      <main className="flex-1">{children}</main>
    </NextIntlClientProvider>
  );
}
