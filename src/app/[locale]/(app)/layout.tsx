import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ApiPreconnect } from "@/components/ApiPreconnect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false } };

const AppGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider>
      <ApiPreconnect />
      {children}
    </NextIntlClientProvider>
  );
};

export default AppGroupLayout;
