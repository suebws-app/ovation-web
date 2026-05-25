"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { EventBookForm } from "@/features/create/EventBookForm";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { eventsClient } from "@/lib/api/events-client";

const parseWeddingDate = (raw: string | null): Date | null => {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const CreatePage = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useCreateEventStore();
  const { partner1Name, partner2Name, displayOrder, weddingDate, venue } =
    formData;
  const setAccountType = useSignUpStore((s) => s.updateFormData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydratedRef = useRef(false);

  useEffect(() => {
    const as = searchParams.get("as");
    if (as === "pro") setAccountType({ accountType: "pro" });
    else if (as === "couple") setAccountType({ accountType: "couple" });
  }, [searchParams, setAccountType]);

  useEffect(() => {
    if (hydratedRef.current) return;
    const editId = searchParams.get("edit");
    if (!editId) return;
    hydratedRef.current = true;
    (async () => {
      try {
        const { event } = await eventsClient.update(editId, {});
        useCreateEventStore.getState().setEditTarget(editId);
        const isFilled = event.kind === "filled";
        updateFormData({
          partner1Name: isFilled ? event.partnerAName : "",
          partner2Name: isFilled ? event.partnerBName : "",
          weddingDate: parseWeddingDate(event.weddingDate),
          venue: event.venueName ?? "",
        });
      } catch {
        useCreateEventStore.getState().setEditTarget(editId);
      }
    })();
  }, [searchParams, updateFormData]);

  const handleContinue = () => router.push(appRoutes.create.cover);

  return (
    <EventBookForm
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
      headerSlot={
        <Kicker className="text-primary mb-3">
          {t("auth__signup__eyebrow_step", {
            step: 1,
            label: t("signup__book_details__step_label"),
          })}
        </Kicker>
      }
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
          onClick={handleContinue}
          disabled={!partner1Name || !partner2Name}
          size="lg"
          className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
        >
          {t("signup__book_details__continue")}
          <ArrowRightIcon width={16} height={16} />
        </Button>
      }
      className="min-h-[calc(100vh-89px)]"
    />
  );
};
