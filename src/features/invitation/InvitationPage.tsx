"use client";

import { startTransition, useEffect, useState } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import type { Event, Invitee } from "@/lib/api/types";
import { InvitationFooter } from "./components/InvitationFooter";
import { InvitationFormPanel } from "./components/InvitationFormPanel";
import { InvitationPreviewPanel } from "./components/InvitationPreviewPanel";
import type { InvitationFields } from "./invitationSchema";
import { useInvitationForm } from "./useInvitationForm";
import { useInvitationStepNavigation } from "./useInvitationStepNavigation";
import { useInvitationStore } from "./useInvitationStore";
import { useInvitationTemplate } from "./useInvitationTemplate";
import { useSaveInvitationStep } from "./useSaveInvitationStep";

type InvitationPageProps = {
  eventId: string | null;
  initialEvent: Event | null;
  initialInvitees: Invitee[];
};

export const InvitationPage = ({
  eventId,
  initialEvent,
  initialInvitees,
}: InvitationPageProps) => {
  const hydrated = useHydrateStore(useInvitationStore);
  const resetStep = useInvitationStore((s) => s.setStep);
  const router = useRouter();
  const methods = useInvitationForm(initialEvent, initialInvitees);
  const { save, status: saveStatus } = useSaveInvitationStep(eventId);

  useEffect(() => {
    if (hydrated) resetStep("design");
  }, [hydrated, resetStep]);

  const { step, stepIdx, isLastStep, handleNext, handleBack } =
    useInvitationStepNavigation({
      methods,
      save,
      onComplete: () => router.push(appRoutes.app.invitees),
    });

  const values = useWatch({ control: methods.control }) as InvitationFields;
  const template = useInvitationTemplate(values);

  const [selectedGuestIndex, setSelectedGuestIndex] = useState<number | null>(
    null,
  );
  const selectedGuest =
    selectedGuestIndex !== null
      ? values?.guests?.[selectedGuestIndex]
      : values?.guests?.[0];

  useEffect(() => {
    if (!hydrated) return;
    if (
      step === "guests" &&
      selectedGuestIndex === null &&
      (values?.guests?.length ?? 0) > 0
    ) {
      startTransition(() => setSelectedGuestIndex(0));
    }
  }, [hydrated, step, selectedGuestIndex, values?.guests]);

  const isSaving = saveStatus === "saving";

  return (
    <FormProvider {...methods}>
      <div className="bg-background relative flex min-h-0 flex-1 flex-col pb-20">
        <div className="desktop:flex-row flex flex-1 flex-col">
          <InvitationFormPanel
            step={step}
            stepIdx={stepIdx}
            saveStatus={saveStatus}
            eventId={eventId}
            selectedGuestIndex={selectedGuestIndex}
            onSelectGuest={setSelectedGuestIndex}
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          />
          <InvitationPreviewPanel
            template={template}
            values={values}
            step={step}
            selectedGuestFirstName={selectedGuest?.first}
          />
        </div>
        <InvitationFooter
          stepIdx={stepIdx}
          isLastStep={isLastStep}
          isSaving={isSaving}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </FormProvider>
  );
};
