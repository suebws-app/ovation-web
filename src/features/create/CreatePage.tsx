"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";

import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { EventBookForm } from "@/features/create/EventBookForm";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { CreatePageSkeleton } from "@/features/create/skeletons/CreatePageSkeleton";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { startNavigation } from "@/components/NavigationProgress";

export const CreatePage = () => {
  const t = useTranslations();
  const hydrated = useHydrateStore(useCreateEventStore);
  const { formData, updateFormData } = useCreateEventStore();
  const { partner1Name, partner2Name, weddingDate, venueName, venueCity } =
    formData;
  const venuePreview = [venueName, venueCity].filter(Boolean).join(", ");
  const setAccountType = useSignUpStore((s) => s.updateFormData);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const as = searchParams.get("as");
    if (as === "pro") setAccountType({ accountType: "pro" });
    else if (as === "couple") setAccountType({ accountType: "couple" });
  }, [searchParams, setAccountType]);

  useEffect(() => {
    const as = searchParams.get("as");
    const target =
      as === "couple" || as === "pro"
        ? `${appRoutes.create.cover}?as=${as}`
        : appRoutes.create.cover;
    router.prefetch(target);
  }, [router, searchParams]);

  const handleContinue = () => {
    const as = searchParams.get("as");
    const target =
      as === "couple" || as === "pro"
        ? `${appRoutes.create.cover}?as=${as}`
        : appRoutes.create.cover;
    startNavigation();
    router.push(target);
  };

  if (!hydrated) return <CreatePageSkeleton />;

  return (
    <EventBookForm
      partnerAName={partner1Name}
      partnerBName={partner2Name}
      weddingDate={weddingDate}
      venuePreview={venuePreview}
      onPartnerAChange={(v) => updateFormData({ partner1Name: v })}
      onPartnerBChange={(v) => updateFormData({ partner2Name: v })}
      onWeddingDateChange={(d) => updateFormData({ weddingDate: d })}
      onContinue={handleContinue}
      subtitle={t("signup__book_details__subtitle")}
      headerSlot={
        <Kicker className="text-primary mb-3">
          {t("auth__signup__eyebrow_step", {
            step: 1,
            label: t("signup__book_details__step_label"),
          })}
        </Kicker>
      }
      venueSlot={
        <div className="tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
          <div>
            <Label htmlFor="venue-name" className="mb-2">
              {t("signup__book_details__venue_name_label")}
            </Label>
            <Input
              id="venue-name"
              value={venueName}
              onChange={(e) => updateFormData({ venueName: e.target.value })}
              placeholder={t("signup__book_details__venue_name_placeholder")}
            />
          </div>
          <div>
            <Label htmlFor="venue-city" className="mb-2">
              {t("signup__book_details__venue_city_label")}
            </Label>
            <Input
              id="venue-city"
              value={venueCity}
              onChange={(e) => updateFormData({ venueCity: e.target.value })}
              placeholder={t("signup__book_details__venue_city_placeholder")}
            />
          </div>
          <p className="type-caption text-muted-foreground tablet:col-span-2 mt-2">
            {t("signup__book_details__venue_hint")}
          </p>
        </div>
      }
      actionSlot={
        <Button
          type="submit"
          disabled={!partner1Name || !partner2Name}
          size="lg"
          className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
        >
          {t("signup__book_details__continue")}
        </Button>
      }
      className="desktop:min-h-[calc(100vh-89px)] desktop:h-auto desktop:overflow-visible h-[calc(100svh-89px)] overflow-hidden"
    />
  );
};
