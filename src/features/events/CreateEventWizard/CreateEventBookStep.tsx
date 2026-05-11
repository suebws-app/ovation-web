"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { EventBookFormPage } from "@/features/events/EventBookFormPage";
import { useCreateEventStore } from "@/features/events/useCreateEventStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const CreateEventBookStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useCreateEventStore();
  const { partner1Name, partner2Name, displayOrder, weddingDate, venue } =
    formData;
  const router = useRouter();

  return (
    <EventBookFormPage
      partnerAName={partner1Name}
      partnerBName={partner2Name}
      weddingDate={weddingDate}
      displayOrder={displayOrder}
      venuePreview={venue}
      onPartnerAChange={(v) => updateFormData({ partner1Name: v })}
      onPartnerBChange={(v) => updateFormData({ partner2Name: v })}
      onWeddingDateChange={(d) => updateFormData({ weddingDate: d })}
      onDisplayOrderChange={(v) => updateFormData({ displayOrder: v })}
      subtitle={t("signup__book_details__subtitle")}
      customOrderOption={t("signup__book_details__display_custom")}
      venueSlot={
        <div className="mt-4">
          <Label htmlFor="venue" className="mb-2">
            {t("signup__book_details__venue_label")}
          </Label>
          <Input
            id="venue"
            value={venue}
            onChange={(e) => updateFormData({ venue: e.target.value })}
            placeholder={t("signup__book_details__venue_placeholder")}
          />
          <p className="type-caption text-muted-foreground mt-2">
            {t("signup__book_details__venue_hint")}
          </p>
        </div>
      }
      actionSlot={
        <Button
          onClick={() => router.push(appRoutes.app.eventsNewCover)}
          disabled={!partner1Name || !partner2Name}
          size="lg"
          className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
        >
          {t("signup__book_details__continue")}
          <ArrowRightIcon width={16} height={16} />
        </Button>
      }
    />
  );
};
