import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = { robots: { index: false } };

const GuestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider>
      {/* TODO: Event-themed header, language picker */}
      <main className="flex-1">{children}</main>
    </NextIntlClientProvider>
  );
};

export default GuestLayout;
