"use client";

import type { EventTypeConfig, FieldDef } from "@/lib/event-types";
import { toIsoDate } from "@/lib/utils/formatDate";
import {
  useCreateEventStore,
  type CreateEventFormData,
} from "@/features/create/useCreateEventStore";
import { DynamicField } from "./DynamicField";
import { COLUMN_TO_STORE_KEY } from "./fieldStoreMap";

type DynamicEventFieldsProps = {
  config: EventTypeConfig;
};

// Must read back in local time to match how `writeValue` parses the input
// (`T00:00:00` with no offset is local). Using toISOString() here shifted the
// value a day back for every timezone ahead of UTC.
const toDateInputValue = (date: Date | null): string =>
  date && !Number.isNaN(date.getTime()) ? toIsoDate(date) : "";

/**
 * Registry-driven create form: renders each of the event type's fields and
 * binds them to the create store. Column fields map onto the existing store
 * keys (sent to the API as legacy-aliased keys); everything else is written to
 * `details`.
 */
export const DynamicEventFields = ({ config }: DynamicEventFieldsProps) => {
  const formData = useCreateEventStore((s) => s.formData);
  const updateFormData = useCreateEventStore((s) => s.updateFormData);

  const readValue = (field: FieldDef): string => {
    const storeKey =
      field.storage === "column" && field.column
        ? COLUMN_TO_STORE_KEY[field.column]
        : undefined;
    if (storeKey === "weddingDate" || storeKey === "endDate") {
      return toDateInputValue(formData[storeKey]);
    }
    if (storeKey) {
      const value = formData[storeKey];
      return typeof value === "string" ? value : "";
    }
    const detail = formData.details[field.key];
    return detail == null ? "" : String(detail);
  };

  const writeValue = (field: FieldDef, value: string) => {
    const storeKey =
      field.storage === "column" && field.column
        ? COLUMN_TO_STORE_KEY[field.column]
        : undefined;
    if (storeKey === "weddingDate" || storeKey === "endDate") {
      const parsed = value ? new Date(`${value}T00:00:00`) : null;
      updateFormData({
        [storeKey]: parsed && !Number.isNaN(parsed.getTime()) ? parsed : null,
      } as Partial<CreateEventFormData>);
      return;
    }
    if (storeKey) {
      updateFormData({
        [storeKey]: value,
      } as Partial<CreateEventFormData>);
      return;
    }
    // Int detail fields (e.g. birthday `age`) must be stored as a number — the
    // API `details` schema validates `z.number()`. Blank clears the key.
    const detailValue =
      field.kind === "int"
        ? value !== "" && Number.isFinite(Number(value))
          ? Number(value)
          : undefined
        : value || undefined;
    updateFormData({
      details: { ...formData.details, [field.key]: detailValue },
    });
  };

  // Image/file fields (e.g. corporate logo, agenda) can't be uploaded during
  // signup — there is no event or authenticated session to upload to yet. They
  // are omitted here and collected in the event settings after creation.
  const createFields = config.fields.filter(
    (field) => field.kind !== "image" && field.kind !== "file",
  );

  return (
    <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
      {createFields.map((field) => (
        <DynamicField
          key={field.key}
          field={field}
          value={readValue(field)}
          onChange={(value) => writeValue(field, value)}
        />
      ))}
    </div>
  );
};
