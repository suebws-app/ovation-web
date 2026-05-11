"use client";

import { CoverPhotoForm } from "@/features/events/CoverPhotoForm";
import { useCreateEventStore } from "@/features/events/useCreateEventStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const CreateEventCoverStep = () => {
  const { formData, updateFormData } = useCreateEventStore();
  const router = useRouter();

  return (
    <CoverPhotoForm
      partner1Name={formData.partner1Name}
      partner2Name={formData.partner2Name}
      weddingDate={formData.weddingDate}
      venue={formData.venue}
      coverType={formData.coverType}
      coverFile={formData.coverFile}
      coverFilePreview={formData.coverFilePreview}
      onCoverChange={(coverType, coverFile, coverFilePreview) =>
        updateFormData({ coverType, coverFile, coverFilePreview })
      }
      onContinue={() => router.push(appRoutes.app.eventsNewUrl)}
    />
  );
};
