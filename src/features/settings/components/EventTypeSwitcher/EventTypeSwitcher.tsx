"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import {
  getEventTypeConfig,
  listEventTypes,
  type EventType,
} from "@/lib/event-types";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/components/Toaster";
import { EventTypeCard } from "@/features/create/components/EventTypeCard";

type EventTypeSwitcherProps = {
  eventId: string;
  currentType: EventType;
  // Controlled: the selected (previewed) type lives in the parent so the
  // details form can preview it before the change is committed here.
  selected: EventType;
  onSelect: (type: EventType) => void;
};

/**
 * Lets a host change an event's type. Selecting a card previews that type's
 * form (in the parent) without saving; fields that don't map to the target type
 * are discarded server-side. The warning lists what will be lost, and the
 * change is only persisted when "Change event type" is clicked (warn + discard).
 */
export const EventTypeSwitcher = ({
  eventId,
  currentType,
  selected,
  onSelect,
}: EventTypeSwitcherProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const targetDetailKeys = new Set(
    getEventTypeConfig(selected)
      .fields.filter((f) => f.storage === "details")
      .map((f) => f.key),
  );
  const lostFields = getEventTypeConfig(currentType).fields.filter(
    (f) => f.storage === "details" && !targetDetailKeys.has(f.key),
  );

  const changed = selected !== currentType;

  const handleConfirm = async () => {
    if (!changed) return;
    setPending(true);
    try {
      await eventsClient.changeType(eventId, selected);
      toast.success(t("settings__event_type__changed"));
      router.refresh();
    } catch (error) {
      toast.error(
        ApiError.isApiError(error)
          ? error.message
          : t("settings__event_type__change_error"),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
        {listEventTypes().map((config) => (
          <EventTypeCard
            key={config.type}
            type={config.type}
            selected={config.type === selected}
            onSelect={onSelect}
          />
        ))}
      </div>
      {changed && lostFields.length > 0 && (
        <p className="type-body-small text-destructive">
          {t("settings__event_type__warn_lost", {
            fields: lostFields.map((f) => t(f.labelKey)).join(", "),
          })}
        </p>
      )}
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={!changed || pending}
        className="w-fit rounded-full"
      >
        {t("settings__event_type__confirm")}
      </Button>
    </div>
  );
};
