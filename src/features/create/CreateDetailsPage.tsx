"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { EventBookForm } from "@/features/create/EventBookForm";
import { DynamicEventFields } from "@/features/create/components/DynamicEventFields";
import { WizardContainer } from "@/features/create/components/WizardContainer";
import { getEventTypeConfig } from "@/lib/event-types";
import { isConsumerRole, isProRole } from "@/lib/auth/account-role";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { CreatePageSkeleton } from "@/features/create/skeletons/CreatePageSkeleton";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { startNavigation } from "@/components/NavigationProgress";

/**
 * Step 3 of the create wizard: the event details form. Renders the wedding
 * book form for weddings, or the registry-driven DynamicEventFields for every
 * other type. Continues to the cover step, carrying the `?as=` role param.
 */
export const CreateDetailsPage = () => {
  const t = useTranslations();
  const hydrated = useHydrateStore(useCreateEventStore);
  const { formData, updateFormData } = useCreateEventStore();
  const {
    eventType,
    partner1Name,
    partner2Name,
    weddingDate,
    venueName,
    venueCity,
  } = formData;
  const venuePreview = [venueName, venueCity].filter(Boolean).join(", ");
  const setAccountType = useSignUpStore((s) => s.updateFormData);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const as = searchParams.get("as");
    if (isProRole(as)) setAccountType({ accountType: "pro" });
    else if (isConsumerRole(as)) setAccountType({ accountType: "host" });
  }, [searchParams, setAccountType]);

  const coverTarget = () => {
    const as = searchParams.get("as");
    return isConsumerRole(as) || isProRole(as)
      ? `${appRoutes.create.cover}?as=${as}`
      : appRoutes.create.cover;
  };

  useEffect(() => {
    router.prefetch(coverTarget());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams]);

  const handleContinue = () => {
    startNavigation();
    router.push(coverTarget());
  };

  if (!hydrated) return <CreatePageSkeleton />;

  const config = getEventTypeConfig(eventType);
  const isWedding = eventType === "wedding";

  return (
    <WizardContainer>
      <Kicker className="text-primary">
        {t("auth__signup__eyebrow_step", {
          step: 3,
          label: t("signup__book_details__step_label"),
        })}
      </Kicker>
      {isWedding ? (
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
          venueSlot={
            <div className="tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
              <div>
                <Label htmlFor="venue-name" className="mb-2">
                  {t("signup__book_details__venue_name_label")}
                </Label>
                <Input
                  id="venue-name"
                  value={venueName}
                  onChange={(e) =>
                    updateFormData({ venueName: e.target.value })
                  }
                  placeholder={t(
                    "signup__book_details__venue_name_placeholder",
                  )}
                />
              </div>
              <div>
                <Label htmlFor="venue-city" className="mb-2">
                  {t("signup__book_details__venue_city_label")}
                </Label>
                <Input
                  id="venue-city"
                  value={venueCity}
                  onChange={(e) =>
                    updateFormData({ venueCity: e.target.value })
                  }
                  placeholder={t(
                    "signup__book_details__venue_city_placeholder",
                  )}
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
              className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
            >
              {t("signup__book_details__continue")}
            </Button>
          }
        />
      ) : (
        <>
          <DynamicEventFields config={config} />
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!partner1Name}
            className="shadow-primary/40 w-full rounded-full shadow-md"
          >
            {t("signup__book_details__continue")}
          </Button>
        </>
      )}
    </WizardContainer>
  );
};
