"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { BookPreview } from "@/features/create/cover/components/BookPreview";
import { CountdownCard } from "@/features/events/components/CountdownCard";

type BookPreviewPanelProps = {
  title: string;
  date?: string;
  venue?: string;
  daysUntil?: number;
};

/**
 * The live cover-preview panel shared by every create-wizard details step. Sits
 * in the `AuthSplitLayout` panel slot and updates as the host fills the form,
 * mirroring what guests see on the finished book.
 */
export const BookPreviewPanel = ({
  title,
  date,
  venue,
  daysUntil = 0,
}: BookPreviewPanelProps) => {
  const t = useTranslations();

  return (
    <>
      <Kicker className="relative tracking-[2.5px] opacity-80">
        {t("signup__book_details__brand_eyebrow")}
      </Kicker>
      <BookPreview
        title={title}
        volumeLabel={t("signup__book_preview__volume")}
        titleFallback={t("signup__book_preview__title_fallback")}
        date={date}
        venue={venue}
      />
      <p className="type-body-small relative max-w-90 leading-relaxed opacity-85">
        {t("signup__book_details__brand_caption")}
      </p>
      {daysUntil > 0 && <CountdownCard days={daysUntil} />}
    </>
  );
};
