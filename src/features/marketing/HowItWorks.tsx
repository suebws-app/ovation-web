"use client";

import { useTranslations } from "next-intl";
import { Mic } from "@ovation/icons/Mic";
import { Play } from "@ovation/icons/Play";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";

const WAVEFORM_HEIGHTS = [
  8, 14, 20, 28, 36, 44, 36, 28, 44, 36, 20, 28, 36, 44, 36, 28, 20, 14, 28, 36,
  20, 12,
];
const MINI_WAVEFORM_HEIGHTS = [4, 8, 12, 8, 16, 10, 6, 14, 8, 12, 6, 10];

type QrCellProps = { index: number };

const QrCell = ({ index }: QrCellProps) => (
  <div
    className="aspect-square rounded-[1px]"
    style={{
      backgroundColor:
        (index + Math.floor(index / 5)) % 2 === 0
          ? "var(--foreground)"
          : "transparent",
    }}
  />
);

type WaveformBarProps = { height: number; variant: "primary" | "mini" };

const WaveformBar = ({ height, variant }: WaveformBarProps) => (
  <div
    className={
      variant === "primary"
        ? "bg-destructive w-[3px] rounded-full opacity-70"
        : "bg-secondary w-[2px] rounded-full opacity-80"
    }
    style={{ height: `${height}px` }}
  />
);

type QrCardProps = { rotation: number; translateX: number };

const QrCard = ({ rotation, translateX }: QrCardProps) => (
  <div
    className="bg-card border-border absolute flex h-[150px] w-[110px] flex-col items-center justify-center gap-1.5 rounded-lg border p-3"
    style={{ transform: `rotate(${rotation}deg) translateX(${translateX}px)` }}
  >
    <div className="grid w-full grid-cols-5 gap-0.5">
      {Array.from({ length: 25 }).map((_, j) => (
        <QrCell key={j} index={j} />
      ))}
    </div>
  </div>
);

const QR_CARDS: Array<{ rotation: number; translateX: number }> = [
  { rotation: -6, translateX: -18 },
  { rotation: 0, translateX: 0 },
  { rotation: 6, translateX: 18 },
];

const Step1Illustration = () => (
  <div className="relative flex h-40 items-center justify-center">
    <div className="relative flex h-[150px] w-[150px] items-center justify-center">
      {QR_CARDS.map((card) => (
        <QrCard
          key={card.rotation}
          rotation={card.rotation}
          translateX={card.translateX}
        />
      ))}
    </div>
  </div>
);

const Step2Illustration = () => (
  <div className="flex h-40 flex-col items-center justify-center gap-4">
    <div
      className="relative flex size-20 items-center justify-center rounded-full"
      style={{
        background:
          "linear-gradient(135deg, var(--destructive), oklch(from var(--destructive) calc(l - 0.1) c h))",
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 0 8px color-mix(in oklch, var(--destructive) 20%, transparent), 0 0 0 16px color-mix(in oklch, var(--destructive) 10%, transparent)",
        }}
      />
      <Mic className="text-primary-foreground" width={32} height={32} />
    </div>
    <div className="flex h-8 items-end gap-[2px]">
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <WaveformBar key={i} height={h} variant="primary" />
      ))}
    </div>
  </div>
);

const Step3Illustration = ({
  quoteText,
  timeLabel,
}: {
  quoteText: string;
  timeLabel: string;
}) => (
  <div className="flex h-40 items-center justify-center">
    <div className="border-border bg-card flex h-[150px] w-[220px] flex-col justify-between rounded-xl border p-4 shadow-lg">
      <span className="text-muted-foreground text-[10px] font-medium">
        {timeLabel}
      </span>
      <p className="text-foreground line-clamp-3 font-serif text-[13px] leading-snug italic">
        {quoteText}
      </p>
      <div className="flex items-center gap-2">
        <div className="bg-secondary flex size-6 flex-shrink-0 items-center justify-center rounded-full">
          <Play className="text-secondary-foreground" width={10} height={10} />
        </div>
        <div className="flex h-4 items-end gap-[2px]">
          {MINI_WAVEFORM_HEIGHTS.map((h, i) => (
            <WaveformBar key={i} height={h} variant="mini" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const STEP_COLORS: Record<number, string> = {
  1: "text-primary",
  2: "text-destructive",
  3: "text-secondary",
};

export const HowItWorks = () => {
  const t = useTranslations();

  const steps = [
    {
      number: "01",
      tag: t("marketing__how__step1_tag"),
      title: t("marketing__how__step1_title"),
      body: t("marketing__how__step1_body"),
      illustration: <Step1Illustration />,
    },
    {
      number: "02",
      tag: t("marketing__how__step2_tag"),
      title: t("marketing__how__step2_title"),
      body: t("marketing__how__step2_body"),
      illustration: <Step2Illustration />,
    },
    {
      number: "03",
      tag: t("marketing__how__step3_tag"),
      title: t("marketing__how__step3_title"),
      body: t("marketing__how__step3_body"),
      illustration: (
        <Step3Illustration
          quoteText={t("marketing__how__step3_quote")}
          timeLabel={t("marketing__how__step3_time_label")}
        />
      ),
    },
  ];

  return (
    <section className="bg-card border-border border-t border-b py-[120px]">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-20">
        <div className="mb-14 flex items-end justify-between">
          <div className="max-w-[640px]">
            <Eyebrow className="text-primary mb-3">
              {t("marketing__how__eyebrow")}
            </Eyebrow>
            <h2 className="font-serif text-[60px] leading-tight font-semibold tracking-tight">
              {t("marketing__how__title_line1")}
              <br />
              <em className="text-primary">
                {t("marketing__how__title_line2")}
              </em>
            </h2>
          </div>
          <div className="max-w-[360px]">
            <p className="text-muted-foreground">
              {t("marketing__how__subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const colorClass = STEP_COLORS[stepNumber];
            return (
              <div
                key={step.number}
                className="bg-background border-border relative flex min-h-[440px] flex-col gap-5 overflow-hidden rounded-3xl border p-8"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-serif text-[44px] leading-none font-semibold italic ${colorClass}`}
                  >
                    {step.number}
                  </span>
                  <span className="text-muted-foreground bg-card border-border rounded-full border px-2.5 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
                    {step.tag}
                  </span>
                </div>

                <div className="flex h-40 items-center justify-center">
                  {step.illustration}
                </div>

                <div className="mt-auto">
                  <h3 className="font-serif text-[28px] font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
