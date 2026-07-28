"use client";

import type { EventStats } from "@/lib/api/types";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";
import { GuestDirectory } from "./components/GuestDirectory";

import { useGuestList } from "./hooks/useGuestList";

type ContributorsPageClientProps = {
  eventId: string;
  stats: EventStats | null;
  inviteUrl: string;
};

export const ContributorsPageClient = ({
  eventId,
}: ContributorsPageClientProps) => {
  const { guests, isPending, isError, isFetchingAll } = useGuestList(eventId);

  return (
    <FeaturePageLayout>
      <GuestDirectory
        eventId={eventId}
        guests={guests}
        isPending={isPending}
        isError={isError}
        isFetchingAll={isFetchingAll}
      />
    </FeaturePageLayout>
  );
};
