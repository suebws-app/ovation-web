import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { AuthLayout } from "@/features/layout/AuthLayout/AuthLayout";

export const metadata: Metadata = { robots: { index: false } };

const AuthGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider>
      <AuthLayout>{children}</AuthLayout>
    </NextIntlClientProvider>
  );
};

export default AuthGroupLayout;
