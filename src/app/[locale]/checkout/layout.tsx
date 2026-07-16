import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { LogoHeader } from "@/components/LogoHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false } };

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider>
      <div className="flex min-h-screen w-full flex-col">
        <LogoHeader />
        <main className="mx-auto flex w-full max-w-160 flex-1 flex-col justify-center gap-6 px-6 py-10">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
};

export default CheckoutLayout;
