import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Logo } from "@ovation/ui/components/Logo";
import { Warning } from "@ovation/icons/Warning";
import { Link } from "@/i18n/navigation";

type CheckoutCancelPageProps = {
  params: Promise<{ orderId: string }>;
};

export const CheckoutCancelPage = async ({
  params,
}: CheckoutCancelPageProps) => {
  const { orderId } = await params;
  const t = await getTranslations();

  return (
    <div className="bg-background min-h-screen">
      <header className="px-6 py-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-140 flex-col items-center gap-6 px-6 py-12 text-center">
        <div className="rounded-16 bg-muted inline-flex size-16 items-center justify-center">
          <Warning width={28} height={28} className="text-muted-foreground" />
        </div>
        <Eyebrow className="text-muted-foreground">
          {t("checkout__cancel__eyebrow")}
        </Eyebrow>
        <h1 className="type-h1 font-serif leading-tight font-semibold tracking-tight">
          {t("checkout__cancel__title")}
        </h1>
        <p className="type-body-small text-muted-foreground max-w-md leading-relaxed">
          {t.rich("checkout__cancel__body", {
            id: orderId.slice(0, 8),
            strong: (chunks) => (
              <span className="text-foreground/85 font-mono">{chunks}</span>
            ),
          })}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link href="/app/keepsakes">
              {t("checkout__cancel__back_keepsakes")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/app">{t("checkout__cancel__skip")}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};
