import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = { robots: { index: false } };

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider>
      <div className="bg-background fixed inset-0 overflow-hidden">
        {children}
      </div>
    </NextIntlClientProvider>
  );
};

export default KioskLayout;
