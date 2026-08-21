"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getDateFnsLocale } from "@/lib/utils/dateFnsLocale";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Calendar } from "@ovation/ui/components/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { cn } from "@ovation/ui/utils/cn";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { BookPreviewPanel } from "@/features/create/components/BookPreviewPanel";

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
  const uiLocale = useLocale();
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const daysUntil = weddingDate
    ? Math.max(
        0,
        Math.ceil((weddingDate.getTime() - new Date().getTime()) / 86400000),
      )
    : 0;

  return (
    <AuthSplitLayout
      className={className}
      panel={
        <BookPreviewPanel
          title={[partnerAName, partnerBName].filter(Boolean).join(" & ")}
          date={weddingDate?.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          venue={venuePreview}
          daysUntil={daysUntil}
        />
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!partnerAName || !partnerBName) return;
          onContinue?.();
        }}
      >
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

        <div className="tablet:mt-7 tablet:grid-cols-[1fr_auto_1fr] mt-4 grid grid-cols-1 items-end gap-3.5">
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
          <span className="text-muted-foreground type-h1 tablet:block hidden pb-2.5 italic">
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
                locale={getDateFnsLocale(uiLocale)}
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
      </form>
    </AuthSplitLayout>
  );
};
