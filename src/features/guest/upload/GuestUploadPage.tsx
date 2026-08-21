import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { EventThemeScope } from "@/lib/theme/EventThemeScope";
import { eventTitleLine } from "@/lib/event-types";
import { guestInitials } from "../welcome/guestInitials";
import { UploadClient } from "./UploadClient";

type GuestUploadPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestUploadPage = async ({
  params,
  searchParams,
}: GuestUploadPageProps) => {
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

  const title = eventTitleLine(event);

  return (
    <EventThemeScope event={event}>
      <UploadClient
        slug={slug}
        title={title}
        initials={guestInitials(title)}
        avatarUrl={event.hostAvatarUrl ?? event.coverPhotoUrl ?? null}
        captureAudio={event.kiosk.captureAudio}
        maxAudioDurationSec={event.kiosk.maxAudioDurationSeconds}
        maxVideoDurationSec={event.kiosk.maxVideoDurationSeconds}
        sourceParam={sourceParam}
        submissionClosed={submissionClosed}
        closedMessage={closedMessage}
      />
    </EventThemeScope>
  );
};
