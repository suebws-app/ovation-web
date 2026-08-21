"use client";

import { useState } from "react";
import type { Event } from "@/lib/api/types";
import { type EventType } from "@/lib/event-types";
import { WeddingDetailsForm } from "./WeddingDetailsForm";
import { EventDetailsFields } from "./EventDetailsFields";
import { EventTypeSwitcher } from "./EventTypeSwitcher";

type EventDetailsSectionProps = {
  event: Event;
};

/**
 * Composes the event-details form with the type switcher. Selecting a type card
 * live-previews that type's form (labels, 2nd host, date label) without saving;
 * the already-entered values are kept. The switch is only persisted when the
 * host clicks "Change event type". While previewing a different type, the
 * current type's detail fields (which auto-save) are hidden — they become
 * editable again once the change is committed.
 */
export const EventDetailsSection = ({ event }: EventDetailsSectionProps) => {
  const savedType = (event.eventType as EventType) ?? "wedding";
  const [previewType, setPreviewType] = useState<EventType>(savedType);
  const previewingChange = previewType !== savedType;

  return (
    <>
      <WeddingDetailsForm
        event={event}
        typeOverride={previewType}
        extraFields={
          previewingChange ? null : <EventDetailsFields event={event} />
        }
      />
      <EventTypeSwitcher
        eventId={event.id}
        currentType={savedType}
        selected={previewType}
        onSelect={setPreviewType}
      />
    </>
  );
};
