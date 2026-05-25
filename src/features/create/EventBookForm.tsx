"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Calendar } from "@ovation/ui/components/DatePicker";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { cn } from "@ovation/ui/utils/cn";
import { BookPreview } from "@/features/create/cover/components/BookPreview";
import { NameOrderOption } from "@/features/events/components/NameOrderOption";
import { CountdownCard } from "@/features/events/components/CountdownCard";

const BLOB_DESTRUCTIVE =
  "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)";
const BLOB_ACCENT =
  "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)";

const NAME_MAX_LENGTH = 24;

type EventBookFormProps = {
  partnerAName: string;
  partnerBName: string;
  weddingDate: Date | null;
  displayOrder: string;
  venuePreview: string;
  onPartnerAChange: (v: string) => void;
  onPartnerBChange: (v: string) => void;
  onWeddingDateChange: (d: Date | null) => void;
  onDisplayOrderChange: (v: string) => void;
  subtitle: string;
  headerSlot?: React.ReactNode;
  venueSlot: React.ReactNode;
  actionSlot: React.ReactNode;
  customOrderOption?: string;
  className?: string;
};

export const EventBookForm = ({
  partnerAName,
  partnerBName,
  weddingDate,
  displayOrder,
  venuePreview,
  onPartnerAChange,
  onPartnerBChange,
  onWeddingDateChange,
  onDisplayOrderChange,
  subtitle,
  headerSlot,
  venueSlot,
  actionSlot,
  customOrderOption,
  className,
}: EventBookFormProps) => {
  const t = useTranslations();
  const [showCalendar, setShowCalendar] = useState(false);

  const orderOptions = [
    `${partnerAName || t("signup__book_details__partner1")} & ${partnerBName || t("signup__book_details__partner2")}`,
    `${partnerBName || t("signup__book_details__partner2")} & ${partnerAName || t("signup__book_details__partner1")}`,
    ...(customOrderOption ? [customOrderOption] : []),
  ];

  const daysUntil = weddingDate
    ? Math.max(
        0,
        Math.ceil((weddingDate.getTime() - new Date().getTime()) / 86400000),
      )
    : 0;

  return (
    <div
      className={cn(
        "desktop:grid desktop:grid-cols-[40%_1fr] grid min-h-full",
        className,
      )}
    >
      <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:items-center desktop:justify-center relative hidden overflow-hidden bg-linear-to-br">
        <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -top-20 -right-20 rounded-full"
          style={{ background: BLOB_DESTRUCTIVE, width: 320, height: 320 }}
        />
        <div
          className="pointer-events-none absolute -bottom-15 -left-10 rounded-full"
          style={{ background: BLOB_ACCENT, width: 260, height: 260 }}
        />
        <div className="relative flex w-full max-w-110 flex-col gap-10 p-16">
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__book_details__brand_eyebrow")}
          </Kicker>
          <div className="relative">
            <BookPreview
              partner1={partnerAName}
              partner2={partnerBName}
              date={weddingDate?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              venue={venuePreview}
            />
            <p className="type-body-small mt-6 leading-relaxed opacity-80">
              {t("signup__book_details__brand_caption")}
            </p>
          </div>
          {daysUntil > 0 && <CountdownCard days={daysUntil} />}
        </div>
      </div>

      <div className="tablet:px-18 flex items-center overflow-y-auto px-6 py-16">
        <div className="w-full max-w-130">
          {headerSlot}
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {t("signup__book_details__title_a")}
            <br />
            <span className="text-primary italic">
              {t("signup__book_details__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-end gap-3.5">
            <div>
              <Label htmlFor="partner-a" className="mb-2">
                {t("signup__book_details__partner1")}
              </Label>
              <Input
                id="partner-a"
                value={partnerAName}
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) => onPartnerAChange(e.target.value)}
                placeholder={t("signup__book_details__name_placeholder")}
              />
            </div>
            <span className="text-muted-foreground type-h1 pb-2.5 italic">
              &amp;
            </span>
            <div>
              <Label htmlFor="partner-b" className="mb-2">
                {t("signup__book_details__partner2")}
              </Label>
              <Input
                id="partner-b"
                value={partnerBName}
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) => onPartnerBChange(e.target.value)}
                placeholder={t("signup__book_details__name_placeholder")}
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2">
              {t("signup__book_details__display_label")}
            </Label>
            <div className="flex flex-wrap gap-2">
              {orderOptions.map((option, index) => (
                <NameOrderOption
                  key={`${option}-${index}`}
                  label={option}
                  active={displayOrder === option}
                  onClick={() => onDisplayOrderChange(option)}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label className="mb-2">
              {t("signup__book_details__date_label")}
            </Label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="group rounded-12 border-border bg-card hover:border-primary/40 hover:shadow-input flex w-full cursor-pointer items-center justify-between border px-4 py-3 shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-8 bg-primary/10 text-primary group-hover:bg-primary/15 flex size-9 items-center justify-center transition-colors">
                  <CalendarIcon width={16} height={16} />
                </span>
                <span
                  className={
                    weddingDate
                      ? "type-body-small text-foreground font-medium"
                      : "type-body-small text-muted-foreground"
                  }
                >
                  {weddingDate
                    ? weddingDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : t("signup__book_details__date_placeholder")}
                </span>
              </div>
              <span className="bg-muted type-caption text-muted-foreground rounded-full px-2.5 py-1 font-medium">
                {weddingDate
                  ? weddingDate.toLocaleDateString("en-US", {
                      weekday: "long",
                    })
                  : t("signup__book_details__date_optional")}
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: showCalendar ? "1fr" : "0fr",
                opacity: showCalendar ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="rounded-16 border-border bg-card mt-3 border p-4 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={weddingDate ?? undefined}
                    onSelect={(date) => {
                      onWeddingDateChange(date ?? null);
                      setShowCalendar(false);
                    }}
                    disabled={{ before: new Date() }}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {venueSlot}
          {actionSlot}
        </div>
      </div>
    </div>
  );
};
