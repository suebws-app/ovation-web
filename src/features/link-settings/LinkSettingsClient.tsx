"use client";

import type { LinkSettings } from "@/lib/api/types";
import { useLinkSettings } from "./useLinkSettings";
import { LinkHeader } from "./components/LinkHeader";
import { LinkActiveCard } from "./components/LinkActiveCard";
import { LinkCoverPhotoCard } from "./components/LinkCoverPhotoCard";
import { LinkHostAvatarCard } from "./components/LinkHostAvatarCard";
import { LinkSubmissionTypesCard } from "./components/LinkSubmissionTypesCard";
import { LinkVideoDurationCard } from "./components/LinkVideoDurationCard";
import { LinkAudioDurationCard } from "./components/LinkAudioDurationCard";
import { LinkGalleryShareCard } from "./components/LinkGalleryShareCard";

type LinkSettingsClientProps = {
  eventId: string;
  slug: string;
  submissionsEnabled: boolean;
  couplePhotoUrl: string | null;
  hostAvatarUrl: string | null;
  initialSettings: LinkSettings;
};

export const LinkSettingsClient = ({
  eventId,
  slug,
  submissionsEnabled,
  couplePhotoUrl,
  hostAvatarUrl,
  initialSettings,
}: LinkSettingsClientProps) => {
  const { settings, patch, isSaving } = useLinkSettings(
    eventId,
    initialSettings,
  );

  return (
    <div className="flex flex-col gap-6">
      <LinkHeader />
      <LinkActiveCard eventId={eventId} enabled={submissionsEnabled} />
      <LinkCoverPhotoCard eventId={eventId} initialPhotoUrl={couplePhotoUrl} />
      <LinkHostAvatarCard eventId={eventId} initialPhotoUrl={hostAvatarUrl} />
      <LinkGalleryShareCard
        slug={slug}
        settings={settings}
        onPatch={patch}
        isSaving={isSaving}
      />
      <LinkSubmissionTypesCard settings={settings} onPatch={patch} />
      {settings.captureVideo && (
        <LinkVideoDurationCard settings={settings} onPatch={patch} />
      )}
      {settings.captureAudio && (
        <LinkAudioDurationCard settings={settings} onPatch={patch} />
      )}
    </div>
  );
};
