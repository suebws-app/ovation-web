"use client";

import { useTranslations } from "next-intl";
import { listEventTypes, type EventType } from "@/lib/event-types";
import { EventTypeCard } from "../EventTypeCard";

type EventTypePickerProps = {
  value: EventType;
  onChange: (type: EventType) => void;
};

export const EventTypePicker = ({ value, onChange }: EventTypePickerProps) => {
  const t = useTranslations();
  const types = listEventTypes();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="type-title text-foreground">
          {t("event__type_picker__title")}
        </h2>
        <p className="type-body-small text-muted-foreground">
          {t("event__type_picker__subtitle")}
        </p>
      </div>
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
        {types.map((config) => (
          <EventTypeCard
            key={config.type}
            type={config.type}
            selected={config.type === value}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  );
};
