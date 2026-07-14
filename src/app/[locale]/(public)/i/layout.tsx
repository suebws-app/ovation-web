import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = { robots: { index: false } };

const InvitationLayout = ({ children }: { children: React.ReactNode }) => {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
};

export default InvitationLayout;
