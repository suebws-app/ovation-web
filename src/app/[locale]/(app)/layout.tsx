import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = { robots: { index: false } };

const AppGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
};

export default AppGroupLayout;
