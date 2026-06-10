"use client";

import type { EventStats } from "@/lib/api/types";
import { GuestDirectory } from "./components/GuestDirectory";

import { useGuestList } from "./hooks/useGuestList";

type GuestsPageClientProps = {
  eventId: string;
  stats: EventStats | null;
  inviteUrl: string;
};

export const GuestsPageClient = ({ eventId }: GuestsPageClientProps) => {
  const { guests, isPending, isError, isFetchingAll } = useGuestList(eventId);

  return (
    <div className="w-full">
      <div className="tablet:p-6 flex flex-col gap-6 p-4">
        <GuestDirectory
          guests={guests}
          isPending={isPending}
          isError={isError}
          isFetchingAll={isFetchingAll}
        />
      </div>
    </div>
  );
};
