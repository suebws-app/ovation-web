"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { EventTypePicker } from "@/features/create/components/EventTypePicker";
import { WizardContainer } from "@/features/create/components/WizardContainer";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { CreatePageSkeleton } from "@/features/create/skeletons/CreatePageSkeleton";
import { useSession } from "@/lib/auth/client";
import { isProRole } from "@/lib/auth/account-role";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { startNavigation } from "@/components/NavigationProgress";

/**
 * Step 1 of the create wizard: pick the event type. Selecting a type continues
 * to the role step for new signups; a logged-in user's role (accountType) is
 * already known, so they skip role and go straight to the details step.
 */
export const CreatePage = () => {
  const t = useTranslations();
  const hydrated = useHydrateStore(useCreateEventStore);
  const eventType = useCreateEventStore((s) => s.formData.eventType);
  const updateFormData = useCreateEventStore((s) => s.updateFormData);
  const { data: session } = useSession();
  const router = useRouter();

  const handleContinue = () => {
    startNavigation();
    const user = session?.user as { accountType?: string } | undefined;
    if (user) {
      const as = isProRole(user.accountType) ? "pro" : "host";
      router.push(`${appRoutes.create.details}?as=${as}`);
      return;
    }
    router.push(appRoutes.create.role);
  };

  if (!hydrated) return <CreatePageSkeleton />;

  return (
    <WizardContainer wide>
      <Kicker className="text-primary">
        {t("auth__signup__eyebrow_step", {
          step: 1,
          label: t("event__type_picker__step_label"),
        })}
      </Kicker>
      <EventTypePicker
        value={eventType}
        onChange={(type) => {
          if (type === eventType) return;
          // Switching event type: clear every type-specific field so stale
          // values (host names, an end date, or another type's `details`)
          // don't leak into the new type.
          updateFormData({
            eventType: type,
            partner1Name: "",
            partner2Name: "",
            weddingDate: null,
            endDate: null,
            venueName: "",
            venueCity: "",
            details: {},
          });
        }}
      />
      <Button
        type="button"
        onClick={handleContinue}
        className="shadow-primary/40 w-full rounded-full shadow-md"
      >
        {t("signup__book_details__continue")}
      </Button>
    </WizardContainer>
  );
};
