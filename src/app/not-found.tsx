import { NextIntlClientProvider } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { loadPublicShellMessages } from "@/i18n/loadMessages";
import { RootHeader } from "@/features/layout/RootHeader";
import { RootFooter } from "@/features/layout/RootFooter";
import { ThemeInitScript } from "@/components/ThemeInitScript";

const RootNotFound = async () => {
  const messages = await loadPublicShellMessages("en");
  const t = (key: string) => (messages[key] as string) ?? key;

  return (
    <html lang="en" className="h-dvh antialiased" suppressHydrationWarning>
      <body className="flex max-h-dvh flex-1 flex-col font-sans">
        <ThemeInitScript />
        <NextIntlClientProvider locale="en" messages={messages}>
          <div className="flex min-h-dvh shrink-0 flex-col">
            <RootHeader />
            <main className="bg-warm-cream relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
              <div
                className="bg-primary/20 pointer-events-none absolute -top-30 -left-30 size-100 rounded-full blur-3xl"
                aria-hidden="true"
              />
              <div
                className="bg-destructive/15 pointer-events-none absolute -right-20 -bottom-30 size-100 rounded-full blur-3xl"
                aria-hidden="true"
              />
              <div
                className="bg-secondary/15 pointer-events-none absolute top-1/3 -right-10 size-75 rounded-full blur-3xl"
                aria-hidden="true"
              />

              <div className="relative w-full max-w-xl">
                <div className="mb-6 flex justify-center">
                  <Kicker className="text-destructive type-body-large">
                    {t("errors__not_found__kicker")}
                  </Kicker>
                </div>

                <h1 className="tablet:type-h0 type-h1 mb-4 text-center leading-none tracking-tighter">
                  <span className="text-foreground block">
                    {t("errors__not_found__headline_line1")}
                  </span>
                  <span className="text-primary block italic">
                    {t("errors__not_found__headline_line2")}
                  </span>
                </h1>

                <p className="type-body text-muted-foreground mb-10 text-center leading-relaxed">
                  {t("errors__not_found__description")}
                </p>

                <div className="flex justify-center">
                  <Button asChild className="rounded-full">
                    <Link href={appRoutes.home}>
                      {t("errors__not_found__back_home")}
                    </Link>
                  </Button>
                </div>
              </div>
            </main>
          </div>
          <RootFooter className="shrink-0" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootNotFound;
