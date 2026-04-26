"use client";

import { useTranslations } from "next-intl";
import { Play } from "@ovation/icons/Play";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";

export const SampleSpread = () => {
  const t = useTranslations();

  return (
    <section className="py-30">
      <div className="container mx-auto max-w-310 px-6 lg:px-20">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div>
            <Eyebrow className="text-primary">
              {t("marketing__sample__eyebrow")}
            </Eyebrow>

            <h2 className="type-display mt-4 font-serif leading-tight font-semibold tracking-tight">
              {t("marketing__sample__title_start")}{" "}
              <span className="italic">
                {t("marketing__sample__title_end")}
              </span>
            </h2>

            <p className="text-muted-foreground type-body-large mt-5 max-w-125 leading-relaxed">
              {t("marketing__sample__description")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-5">
              <div>
                <p className="text-primary type-h1 font-serif font-semibold tracking-tight">
                  {t("marketing__sample__stat1_value")}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-snug">
                  {t("marketing__sample__stat1_label")}
                </p>
              </div>
              <div>
                <p className="text-primary type-h1 font-serif font-semibold tracking-tight">
                  {t("marketing__sample__stat2_value")}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-snug">
                  {t("marketing__sample__stat2_label")}
                </p>
              </div>
              <div>
                <p className="text-primary type-h1 font-serif font-semibold tracking-tight">
                  {t("marketing__sample__stat3_value")}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-snug">
                  {t("marketing__sample__stat3_label")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border relative rounded-3xl border p-10 shadow-xl">
            <span className="bg-destructive text-primary-foreground type-overline absolute -top-3.5 right-8 rounded-full px-3 py-1.5 font-semibold shadow-md">
              {t("marketing__sample__saved_tag")}
            </span>

            <p className="text-muted-foreground type-overline mb-4 font-bold tracking-widest uppercase">
              {t("marketing__sample__entry_label")}
            </p>

            <blockquote className="type-h2 font-serif leading-snug font-medium italic">
              {t("marketing__sample__quote")}
            </blockquote>

            <div className="border-border my-6 border-t border-dashed" />

            <div className="flex items-center gap-3.5">
              <div className="from-accent to-accent/70 flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br">
                <span className="text-primary-foreground font-serif text-sm font-semibold">
                  AC
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm leading-tight font-semibold">
                  {t("marketing__sample__author_name")}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {t("marketing__sample__author_role")}
                </p>
              </div>

              <button
                type="button"
                className="bg-primary flex size-10.5 flex-shrink-0 items-center justify-center rounded-full shadow-lg"
              >
                <Play
                  width={16}
                  height={16}
                  className="text-primary-foreground"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
