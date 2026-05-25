import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Logo } from "@ovation/ui/components/Logo";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const PaymentSuccessPage = async () => {
  const t = await getTranslations();

  return (
    <div className="bg-background min-h-screen">
      <header className="px-6 py-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-col items-center px-6 py-16 text-center">
        <div className="rounded-16 bg-secondary/15 mb-6 inline-flex size-20 items-center justify-center">
          <CheckIcon
            width={36}
            height={36}
            className="text-secondary"
            strokeWidth={2.5}
          />
        </div>

        <Kicker className="text-secondary">
          {t("checkout__success__eyebrow")}
        </Kicker>
        <h1 className="type-h1 mt-3 leading-tight font-semibold tracking-tight">
          {t("checkout__payment_success__title")}
        </h1>
        <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-sm leading-relaxed">
          {t("checkout__payment_success__body")}
        </p>

        <Button asChild size="lg" className="shadow-primary/40 mt-10 rounded-full shadow-md">
          <Link href={appRoutes.app.root}>
            {t("checkout__payment_success__cta")}
          </Link>
        </Button>
      </main>
    </div>
  );
};
