import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { ComposeClient } from "./compose/ComposeClient";
import { InvitationOpenTracker } from "./InvitationOpenTracker";

type GuestComposePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestComposePage = async ({
  params,
  searchParams,
}: GuestComposePageProps) => {
  const { slug } = await params;
  const search = await searchParams;
  const sourceParam = typeof search.source === "string" ? search.source : null;

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  const t = await getTranslations();
  const submissionClosed = !event.submissionOpen || event.limitReached;
  const closedMessage = event.limitReached
    ? t("guest__landing__closed_limit")
    : !event.submissionOpen
      ? t("guest__landing__closed_not_open")
      : t("guest__landing__closed_other");

  return (
    <GuestWizardShell event={event}>
      <InvitationOpenTracker slug={slug} />
      <ComposeClient
        slug={slug}
        captureAudio={event.kiosk.captureAudio}
        captureVideo={event.kiosk.captureVideo}
        capturePhoto={event.kiosk.capturePhoto}
        maxVideoDurationSec={event.kiosk.maxVideoDurationSeconds}
        maxAudioDurationSec={event.kiosk.maxAudioDurationSeconds}
        sourceParam={sourceParam}
        submissionClosed={submissionClosed}
        closedMessage={closedMessage}
      />
    </GuestWizardShell>
  );
};
