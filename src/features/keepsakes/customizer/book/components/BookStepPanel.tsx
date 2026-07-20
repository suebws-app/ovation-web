"use client";

import { useTranslations } from "next-intl";
import { BookHeaderBadge } from "../BookHeaderBadge";
import { PaperSelect } from "../PaperSelect";
import { SizeSelect } from "../SizeSelect";
import { DensitySelect } from "../DensitySelect";
import { PageCountSection } from "../PageCountSection";
import { PersonalizeSection } from "../PersonalizeSection";
import { CoverDesignSelector } from "../CoverDesignSelector";
import { CoverPreviewCard } from "../CoverPreviewCard";
import { BookCheckoutPanel } from "../BookCheckoutPanel";
import { BookOrderSummary } from "../BookOrderSummary";
import { BOOK_STEP_LABEL_KEYS, type BookStepId } from "../bookSteps";
import type { BookBinding } from "../BookFormContext";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type BookStepPanelProps = {
  step: BookStepId;
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  event?: Event | null;
  binding: BookBinding;
  isPro: boolean;
  photosError: boolean;
  onRegisterBuyNow: (fn: (() => void) | null) => void;
};

export const BookStepPanel = ({
  step,
  product,
  variants,
  eventId,
  event,
  binding,
  isPro,
  photosError,
  onRegisterBuyNow,
}: BookStepPanelProps) => {
  const t = useTranslations();

  const renderSummary = (hideNotReady = false) => (
    <BookOrderSummary
      product={product}
      variants={variants}
      eventId={eventId}
      binding={binding}
      hideNotReady={hideNotReady}
    />
  );

  return (
    <div className="flex w-full flex-col gap-4 pb-24">
      <BookHeaderBadge
        binding={binding}
        variants={variants}
        eventId={eventId}
      />
      <h2 className="type-body-large font-semibold">
        {t(BOOK_STEP_LABEL_KEYS[step])}
      </h2>

      {step === "format" && (
        <div className="small-desktop:grid-cols-[1fr_360px] grid w-full grid-cols-1 gap-6">
          <div className="flex flex-col gap-4">
            <PaperSelect variants={variants} />
            <SizeSelect variants={variants} />
            <DensitySelect />
          </div>
          <div>
            <div className="small-desktop:sticky small-desktop:top-4">
              {renderSummary(true)}
            </div>
          </div>
        </div>
      )}

      {step === "photos" && (
        <div className="small-desktop:grid-cols-[1fr_360px] grid w-full grid-cols-1 gap-6">
          <div className="flex flex-col gap-4">
            <PageCountSection
              variants={variants}
              eventId={eventId}
              event={event}
              isPro={isPro}
            />
            {photosError && (
              <p className="type-caption text-destructive">
                {t("keepsakes__book_customizer__photos_required")}
              </p>
            )}
          </div>
          <div>
            <div className="small-desktop:sticky small-desktop:top-4">
              {renderSummary()}
            </div>
          </div>
        </div>
      )}

      {step === "cover" && (
        <div className="small-desktop:grid-cols-[1fr_360px] grid w-full grid-cols-1 gap-6">
          <div className="flex flex-col gap-4">
            <CoverDesignSelector eventId={eventId} event={event} />
            <PersonalizeSection variants={variants} eventId={eventId} />
          </div>
          <div>
            <div className="small-desktop:sticky small-desktop:top-4 space-y-4">
              <CoverPreviewCard eventId={eventId} event={event} />
              <div id="book-checkout">
                <BookCheckoutPanel
                  product={product}
                  variants={variants}
                  eventId={eventId}
                  event={event}
                  binding={binding}
                  isPro={isPro}
                  onRegisterBuyNow={onRegisterBuyNow}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
