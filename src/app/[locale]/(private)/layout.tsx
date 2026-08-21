import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getCurrentEvent } from "@/lib/auth/current-event";
import { EventThemeScope } from "@/lib/theme/EventThemeScope";
import { ApiPreconnect } from "@/components/ApiPreconnect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false } };

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const event = await getCurrentEvent().catch(() => null);
  return (
    <NextIntlClientProvider>
      <ApiPreconnect />
      <EventThemeScope
        event={{
          themeColor: event?.themeColor,
          eventType: event?.eventType,
        }}
      >
        <main className="flex-1">{children}</main>
      </EventThemeScope>
    </NextIntlClientProvider>
  );
}
