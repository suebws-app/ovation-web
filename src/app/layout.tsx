import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ovation — Capture Your Wedding Messages",
  description:
    "Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
