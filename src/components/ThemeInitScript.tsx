import Script from "next/script";

export const ThemeInitScript = () => (
  // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
  <Script id="theme-init" src="/theme-init.js" strategy="beforeInteractive" />
);
