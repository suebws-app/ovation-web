"use client";

import { ClaimUrlForm } from "@/features/events/ClaimUrlForm";
import { useCreateEventStore } from "@/features/events/useCreateEventStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const CreateEventUrlStep = () => {
  const { formData, updateFormData } = useCreateEventStore();
  const router = useRouter();

  return (
    <ClaimUrlForm
      partner1Name={formData.partner1Name}
      partner2Name={formData.partner2Name}
      weddingDate={formData.weddingDate}
      venue={formData.venue}
      bookUrl={formData.bookUrl}
      onBookUrlChange={(url) => updateFormData({ bookUrl: url })}
      onContinue={() => router.push(appRoutes.app.eventsNewDone)}
    />
  );
};
