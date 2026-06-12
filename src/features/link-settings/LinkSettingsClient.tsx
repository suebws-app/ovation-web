"use client";

import type { LinkSettings } from "@/lib/api/types";
import { useLinkSettings } from "./useLinkSettings";
import { LinkHeader } from "./components/LinkHeader";
import { LinkActiveCard } from "./components/LinkActiveCard";
import { LinkCouplePhotoCard } from "./components/LinkCouplePhotoCard";
import { LinkSubmissionTypesCard } from "./components/LinkSubmissionTypesCard";
import { LinkVideoDurationCard } from "./components/LinkVideoDurationCard";
import { LinkAudioDurationCard } from "./components/LinkAudioDurationCard";

type LinkSettingsClientProps = {
  eventId: string;
  slug: string;
  submissionsEnabled: boolean;
  couplePhotoUrl: string | null;
  initialSettings: LinkSettings;
};

export const LinkSettingsClient = ({
  eventId,
  slug,
  submissionsEnabled,
  couplePhotoUrl,
  initialSettings,
}: LinkSettingsClientProps) => {
  const { settings, patch } = useLinkSettings(eventId, initialSettings);

  return (
    <div className="flex flex-col gap-6">
      <LinkHeader slug={slug} />
      <LinkActiveCard eventId={eventId} enabled={submissionsEnabled} />
      <LinkCouplePhotoCard eventId={eventId} initialPhotoUrl={couplePhotoUrl} />
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
