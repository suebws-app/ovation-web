"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";

type StatCardProps = { value: string; label: string };

const StatCard = ({ value, label }: StatCardProps) => (
  <div className="rounded-2xl border border-white/[0.18] bg-white/10 p-4.5 backdrop-blur">
    <p className="font-serif text-[34px] leading-none font-semibold">{value}</p>
    <p className="mt-0.5 text-xs opacity-80">{label}</p>
  </div>
);

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
    <section className="from-primary to-primary/80 text-primary-foreground relative overflow-hidden bg-gradient-to-br py-[120px]">
      <div className="bg-destructive/30 pointer-events-none absolute top-[-100px] right-[-80px] size-[400px] rounded-full blur-3xl" />
      <div className="bg-accent/25 pointer-events-none absolute bottom-[-80px] left-[-60px] size-[320px] rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-20">
        <Eyebrow className="mb-6 opacity-75">
          {t("marketing__testimonial__eyebrow")}
        </Eyebrow>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <blockquote className="font-serif text-3xl leading-tight font-medium tracking-tight italic lg:text-[50px]">
              {t("marketing__testimonial__quote")}
            </blockquote>

            <div className="mt-10 flex items-center gap-4">
              <div className="bg-accent/60 flex size-[52px] shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold">
                SR
              </div>
              <div>
                <p className="text-[15px] font-semibold">
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
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
