import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Ovation — Capture Your Wedding Messages",
  description:
    "Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.",
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
