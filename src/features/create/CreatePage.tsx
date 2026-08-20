"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { EventTypePicker } from "@/features/create/components/EventTypePicker";
import { WizardContainer } from "@/features/create/components/WizardContainer";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { CreatePageSkeleton } from "@/features/create/skeletons/CreatePageSkeleton";
import { useSession } from "@/lib/auth/client";
import {
  CONSUMER_ACCOUNT_TYPE,
  isConsumerRole,
  isProRole,
} from "@/lib/auth/account-role";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { startNavigation } from "@/components/NavigationProgress";

/**
 * Step 1 of the create wizard: pick the event type. Continues to the details
 * step, carrying the role along as `?as=` so the later steps and signup keep
 * it. A logged-in user's role comes from their account; a logged-out visitor's
 * comes from the incoming `?as=`, which only the pro surfaces (/for-pros and
 * the professionals tab on /pricing) ever set.
 */
export const CreatePage = () => {
  const t = useTranslations();
  const hydrated = useHydrateStore(useCreateEventStore);
  const eventType = useCreateEventStore((s) => s.formData.eventType);
  const updateFormData = useCreateEventStore((s) => s.updateFormData);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleContinue = () => {
    startNavigation();
    const user = session?.user as { accountType?: string } | undefined;
    if (user) {
      const as = isProRole(user.accountType) ? "pro" : CONSUMER_ACCOUNT_TYPE;
      router.push(`${appRoutes.create.details}?as=${as}`);
      return;
    }
    const as = searchParams.get("as");
    if (isProRole(as) || isConsumerRole(as)) {
      router.push(`${appRoutes.create.details}?as=${as}`);
      return;
    }
    router.push(appRoutes.create.details);
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
