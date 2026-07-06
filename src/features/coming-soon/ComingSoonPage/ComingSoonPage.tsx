import { getTranslations } from "next-intl/server";
import { Logo } from "@ovation/ui/components/Logo";
import { Kicker } from "@ovation/ui/components/Kicker";
import { FeaturePill } from "./FeaturePill";
import { WaitlistSection } from "./WaitlistSection";
import { UnlockSection } from "./UnlockSection";

export const ComingSoonPage = async () => {
  const t = await getTranslations();
  return (
    <main className="bg-warm-cream relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16">
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
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 flex justify-center">
          <Kicker className="text-destructive">
            {t("coming_soon__kicker")}
          </Kicker>
        </div>

        <h1 className="tablet:type-h0 type-h1 mb-4 text-center leading-none tracking-tighter">
          <span className="text-foreground block">
            {t("coming_soon__headline_line1")}
          </span>
          <span className="text-primary block italic">
            {t("coming_soon__headline_line2")}
          </span>
        </h1>

        <p className="type-body text-muted-foreground mb-8 text-center leading-relaxed">
          {t("coming_soon__description")}
        </p>

        <div className="mb-10 flex flex-col gap-2.5">
          <FeaturePill text={t("coming_soon__feature_1")} />
          <FeaturePill text={t("coming_soon__feature_2")} />
          <FeaturePill text={t("coming_soon__feature_3_v2")} />
        </div>

        <div className="rounded-24 border-border bg-card border p-6 shadow">
          <Kicker className="text-muted-foreground mb-4">
            {t("coming_soon__waitlist_kicker")}
          </Kicker>
          <WaitlistSection />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <span className="type-caption text-muted-foreground">
            {t("common__or")}
          </span>
          <div className="bg-border h-px flex-1" />
        </div>

        <div className="rounded-24 border-border bg-card border p-6 shadow">
          <Kicker className="text-muted-foreground mb-4">
            {t("coming_soon__preview_access_kicker")}
          </Kicker>
          <UnlockSection />
        </div>

        <p className="type-caption text-muted-foreground mt-10 text-center">
          {t("coming_soon__copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </main>
  );
};
