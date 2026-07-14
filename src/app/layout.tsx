import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { appUrl } from "@/lib/seo/urls";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Ovation — Capture Your Wedding Messages",
    template: "%s | Ovation",
  },
  description:
    "Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.",
  openGraph: {
    type: "website",
    siteName: "Ovation",
    title: "Ovation — Capture Your Wedding Messages",
    description:
      "Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ovation — Capture Your Wedding Messages",
    description:
      "Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.",
  },
  robots: { index: true, follow: true },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <SpeedInsights />
      <Analytics />
      {children}
    </>
  );
};

export default RootLayout;
