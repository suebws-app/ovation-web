"use client";

import type { LinkSettings } from "@/lib/api/types";
import { useLinkSettings } from "./useLinkSettings";
import { LinkHeader } from "./components/LinkHeader";
import { LinkActiveCard } from "./components/LinkActiveCard";
import { LinkSubmissionTypesCard } from "./components/LinkSubmissionTypesCard";
import { LinkMaxDurationCard } from "./components/LinkMaxDurationCard";

type LinkSettingsClientProps = {
  eventId: string;
  slug: string;
  submissionsEnabled: boolean;
  initialSettings: LinkSettings;
};

export const LinkSettingsClient = ({
  eventId,
  slug,
  submissionsEnabled,
  initialSettings,
}: LinkSettingsClientProps) => {
  const { settings, patch } = useLinkSettings(eventId, initialSettings);

  return (
    <div className="flex flex-col gap-6">
      <LinkHeader slug={slug} />
      <LinkActiveCard eventId={eventId} enabled={submissionsEnabled} />
      <LinkSubmissionTypesCard settings={settings} onPatch={patch} />
      <LinkMaxDurationCard settings={settings} onPatch={patch} />
    </div>
  );
};
