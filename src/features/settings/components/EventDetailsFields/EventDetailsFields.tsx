"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Input } from "@ovation/ui/components/Input";
import { getEventTypeConfig, type FieldDef } from "@/lib/event-types";
import type { Event } from "@/lib/api/types";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { SettingsField } from "../SettingsField";
import { DetailAssetUpload } from "./DetailAssetUpload";

type EventDetailsFieldsProps = {
  event: Event;
};

/**
 * Settings editor for a type's `details` fields (e.g. corporate logo + agenda).
 * This is where uploads live: the event exists and the session is
 * authenticated, so the event-scoped asset upload works. Each change persists
 * immediately via events update.
 */
export const EventDetailsFields = ({ event }: EventDetailsFieldsProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [details, setDetails] = useState<Record<string, unknown>>(
    event.details ?? {},
  );
  const [error, setError] = useState<string | null>(null);

  const config = getEventTypeConfig(event.eventType);
  const detailFields = config.fields.filter((f) => f.storage === "details");

  if (detailFields.length === 0) return null;

  const save = async (next: Record<string, unknown>) => {
    const prev = details;
    setDetails(next);
    setError(null);
    try {
      await eventsClient.update(event.id, { details: next });
      router.refresh();
    } catch (e) {
      // Revert the optimistic change and surface the blocker instead of
      // silently dropping it.
      setDetails(prev);
      setError(
        ApiError.isApiError(e) && e.message
          ? e.message
          : t("settings__wedding__save_error"),
      );
    }
  };

  const stringValue = (key: string): string => {
    const v = details[key];
    return v == null ? "" : String(v);
  };

  const renderField = (field: FieldDef) => {
    const label = t(field.labelKey);
    if (field.kind === "image" || field.kind === "file") {
      return (
        <DetailAssetUpload
          key={field.key}
          eventId={event.id}
          field={field.key}
          label={label}
          kind={field.kind === "image" ? "image" : "file"}
          value={stringValue(field.key) || undefined}
          onChange={(url) => save({ ...details, [field.key]: url })}
        />
      );
    }
    return (
      <SettingsField key={field.key} label={label}>
        <Input
          type={field.kind === "int" ? "number" : "text"}
          defaultValue={stringValue(field.key)}
          onBlur={(e) => {
            const raw = e.target.value.trim();
            if (raw === stringValue(field.key)) return;
            // Int fields must be sent as a number — the API `details` schema
            // validates `z.number()`, so a string would be rejected.
            const value =
              field.kind === "int"
                ? raw !== "" && Number.isFinite(Number(raw))
                  ? Number(raw)
                  : undefined
                : raw || undefined;
            save({ ...details, [field.key]: value });
          }}
        />
      </SettingsField>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {detailFields.map(renderField)}
      {error && (
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
