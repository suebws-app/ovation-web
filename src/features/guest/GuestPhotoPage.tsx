import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { PhotoClient } from "./photo/PhotoClient";

type GuestPhotoPageProps = {
  params: Promise<{ slug: string }>;
};

export const GuestPhotoPage = async ({ params }: GuestPhotoPageProps) => {
  const { slug } = await params;

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  if (!event.submissionOpen || event.limitReached) {
    redirect(`/g/${slug}`);
  }

  return (
    <GuestWizardShell event={event}>
      <PhotoClient slug={slug} />
    </GuestWizardShell>
  );
};
