import { Rubik } from "next/font/google";
import "@/app/globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "optional",
  adjustFontFallback: true,
});

const ComingSoonLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={`${rubik.variable} antialiased`}>
    <body className="font-sans">{children}</body>
  </html>
);

export default ComingSoonLayout;
