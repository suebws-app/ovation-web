"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { TestimonialStatCard } from "./TestimonialStatCard";

export const TestimonialSection = () => {
  const t = useTranslations();

  const stats = [
    {
      value: t("marketing__testimonial__stat1_value"),
      label: t("marketing__testimonial__stat1_label"),
    },
    {
      value: t("marketing__testimonial__stat2_value"),
      label: t("marketing__testimonial__stat2_label"),
    },
    {
      value: t("marketing__testimonial__stat3_value"),
      label: t("marketing__testimonial__stat3_label"),
    },
  ];

  return (
    <section className="from-primary to-primary/80 text-primary-foreground relative overflow-hidden bg-linear-to-br py-30">
      <div className="bg-destructive/30 pointer-events-none absolute -top-25 -right-20 size-100 rounded-full blur-3xl" />
      <div className="bg-accent/25 pointer-events-none absolute -bottom-20 -left-15 size-80 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-310 px-6 lg:px-20">
        <Eyebrow className="mb-6 opacity-75">
          {t("marketing__testimonial__eyebrow")}
        </Eyebrow>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <blockquote className="lg:type-display font-serif text-3xl leading-tight font-medium tracking-tight italic">
              {t("marketing__testimonial__quote")}
            </blockquote>

            <div className="mt-10 flex items-center gap-4">
              <div className="bg-accent/60 flex size-13 shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold">
                {t("marketing__testimonial__couple_initials")}
              </div>
              <div>
                <p className="type-body font-semibold">
                  {t("marketing__testimonial__couple_name")}
                </p>
                <p className="text-sm opacity-80">
                  {t("marketing__testimonial__couple_detail")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {stats.map((stat, index) => (
              <TestimonialStatCard
                key={index}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
