"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Calendar } from "@ovation/ui/components/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { cn } from "@ovation/ui/utils/cn";
import { BookPreview } from "@/features/create/cover/components/BookPreview";
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
  venuePreview: string;
  onPartnerAChange: (v: string) => void;
  onPartnerBChange: (v: string) => void;
  onWeddingDateChange: (d: Date | null) => void;
  subtitle: string;
  headerSlot?: React.ReactNode;
  venueSlot: React.ReactNode;
  actionSlot: React.ReactNode;
  onContinue?: () => void;
  className?: string;
};

export const EventBookForm = ({
  partnerAName,
  partnerBName,
  weddingDate,
  venuePreview,
  onPartnerAChange,
  onPartnerBChange,
  onWeddingDateChange,
  subtitle,
  headerSlot,
  venueSlot,
  actionSlot,
  onContinue,
  className,
}: EventBookFormProps) => {
  const t = useTranslations();
  const [datePickerOpen, setDatePickerOpen] = useState(false);

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

      <form
        className="tablet:px-18 tablet:pt-10 tablet:pb-12 flex h-full items-start overflow-y-auto px-5 pt-5 pb-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!partnerAName || !partnerBName) return;
          onContinue?.();
        }}
      >
        <div className="w-full max-w-130">
          {headerSlot}
          <h1 className="type-h2 tablet:type-h1 leading-tight font-semibold tracking-tight">
            {t("signup__book_details__title_a")}{" "}
            <span className="text-primary italic">
              {t("signup__book_details__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground tablet:mt-3 mt-1.5 leading-relaxed">
            {subtitle}
          </p>

          <div className="tablet:mt-7 mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-3.5">
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

          <div className="tablet:mt-6 mt-3">
            <Label className="mb-2 flex items-center gap-1.5">
              <span>{t("signup__book_details__date_label")}</span>
              <span className="text-muted-foreground font-normal">
                ({t("signup__book_details__date_optional")})
              </span>
            </Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring hover:border-primary/40 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <CalendarIcon
                    width={16}
                    height={16}
                    className="text-primary shrink-0"
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      weddingDate ? "font-medium" : "text-muted-foreground",
                    )}
                  >
                    {weddingDate
                      ? weddingDate.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : t("signup__book_details__date_placeholder")}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="rounded-16 w-auto p-3"
              >
                <Calendar
                  mode="single"
                  selected={weddingDate ?? undefined}
                  onSelect={(date) => {
                    onWeddingDateChange(date ?? null);
                    setDatePickerOpen(false);
                  }}
                  disabled={{ before: new Date() }}
                  className="mx-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {venueSlot}
          {actionSlot}
        </div>
      </form>
    </div>
  );
};
