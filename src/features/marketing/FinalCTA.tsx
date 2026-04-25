"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { Check } from "@ovation/icons/Check";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";

export const FinalCTA = () => {
  const t = useTranslations();

  return (
    <section className="pb-[100px]">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-20">
        <div className="from-warm-cream to-warm-panel border-warm-panel relative overflow-hidden rounded-[32px] border bg-gradient-to-br p-12 shadow-2xl lg:p-[72px_80px]">
          <div className="bg-destructive/30 pointer-events-none absolute top-[-120px] right-[-80px] size-[360px] rounded-full blur-3xl" />
          <div className="bg-primary/25 pointer-events-none absolute bottom-[-120px] left-[-40px] size-[320px] rounded-full blur-3xl" />
          <div className="bg-secondary/20 pointer-events-none absolute top-10 left-[45%] size-[180px] rounded-full blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="relative">
              <Eyebrow className="text-destructive">
                {t("marketing__cta__eyebrow")}
              </Eyebrow>
              <h2 className="text-foreground mt-3.5 font-serif text-5xl leading-none font-semibold tracking-tight lg:text-[64px]">
                {t("marketing__cta__title_line1")}
                <br />
                <span className="text-primary italic">
                  {t("marketing__cta__title_line2")}
                </span>
              </h2>
              <p className="text-muted-foreground mt-5 max-w-[460px] text-base leading-relaxed">
                {t("marketing__cta__description")}
              </p>
            </div>

            <div className="relative">
              <p className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                {t("marketing__cta__quick_start")}
              </p>

              <div className="bg-card/75 border-border mt-3 flex items-center gap-2.5 rounded-2xl border p-4 backdrop-blur">
                <span className="text-muted-foreground bg-card border-border rounded-full border px-2.5 py-1 text-xs">
                  {t("marketing__cta__domain_prefix")}
                </span>
                <span className="text-foreground flex-1 font-serif text-base italic">
                  {t("marketing__cta__domain_placeholder")}
                </span>
                <span className="bg-secondary flex size-5.5 items-center justify-center rounded-full">
                  <Check
                    width={12}
                    height={12}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </span>
              </div>

              <button className="bg-destructive mt-3.5 flex w-full items-center justify-center gap-2 rounded-full py-4.5 text-base font-semibold text-white shadow-xl">
                {t("marketing__cta__button")}
                <ArrowRight />
              </button>

              <p className="text-muted-foreground mt-3.5 text-center text-xs">
                {t("marketing__cta__disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
