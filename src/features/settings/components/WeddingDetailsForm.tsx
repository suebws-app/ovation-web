"use client";

import { useMemo, useState } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { MapPinIcon } from "@ovation/icons/MapPinIcon";
import { CopyIcon } from "@ovation/icons/CopyIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/components/Toaster";
import { clientEnv as env } from "@/lib/utils/env.client";
import type { Event } from "@/lib/api/types";
import { toIsoDate, parseIsoDate } from "@/lib/utils/formatDate";
import { getWeddingSchema, type WeddingFields } from "../weddingSchema";
import { Switch } from "@ovation/ui/components/Switch";
import { SettingsField } from "./SettingsField";
import {
  getEventTypeConfig,
  hasEndDateField,
  type EventColumn,
  type EventType,
} from "@/lib/event-types";
import { DateFieldControl } from "./DateFieldControl";
import { ThemeColorField } from "./ThemeColorField";
import { EventThemePreview } from "@/lib/theme/EventThemePreview";

type WeddingDetailsFormProps = {
  event: Event;
  // Rendered inside the form, right after the host/organization name row —
  // used for the type's detail fields (e.g. corporate logo + agenda uploads).
  extraFields?: React.ReactNode;
  // Preview a different type's field layout (labels, 2nd host, date label)
  // without saving — the actual switch is committed via EventTypeSwitcher.
  typeOverride?: EventType;
};

const eventDateToInput = (raw: string | null): string => {
  const d = parseIsoDate(raw);
  return d ? toIsoDate(d) : "";
};

const FIELD_ORDER: (keyof WeddingFields)[] = [
  "partnerAName",
  "partnerBName",
  "weddingDate",
  "endDate",
  "venueName",
  "venueCity",
  "welcomeMessage",
  "slug",
];

const invalidFieldClass =
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-destructive";

const scrollToFirstError = (formErrors: FieldErrors<WeddingFields>) => {
  if (typeof document === "undefined") return;
  const first = FIELD_ORDER.find((name) => formErrors[name]);
  if (!first) return;
  const anchor = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
  if (!anchor) return;
  anchor.scrollIntoView({ behavior: "smooth", block: "center" });
  anchor
    .querySelector<HTMLElement>("input, textarea, button")
    ?.focus({ preventScroll: true });
};

export const WeddingDetailsForm = ({
  event,
  extraFields,
  typeOverride,
}: WeddingDetailsFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const schema = useMemo(() => getWeddingSchema(t), [t]);

  const config = getEventTypeConfig(typeOverride ?? event.eventType);
  const labelForColumn = (column: EventColumn, fallbackKey: string): string => {
    const field = config.fields.find((f) => f.column === column);
    return t(field ? field.labelKey : fallbackKey);
  };
  const hasSecondHost = config.fields.some((f) => f.column === "hostBName");
  const showEndDate = hasEndDateField(config);
  const showExpectedGuests = config.fields.some(
    (f) => f.column === "expectedGuests",
  );
  // Corporate renders its own event-name field via EventDetailsFields, and
  // custom-noun types ("other") already use the host-name column as the event
  // name — don't add a duplicate generic field for those.
  const showEventName =
    !config.fields.some((f) => f.key === "eventName") && !config.customNoun;
  const currentDetails = (event.details ?? {}) as Record<string, unknown>;
  const endDateLabel =
    config.fields.find((f) => f.column === "endDate")?.labelKey ??
    "event__field__end_date";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WeddingFields>({
    defaultValues: {
      partnerAName: event.partnerAName ?? "",
      partnerBName: event.partnerBName ?? "",
      eventName:
        typeof currentDetails.eventName === "string"
          ? currentDetails.eventName
          : "",
      weddingDate: eventDateToInput(event.weddingDate),
      endDate: eventDateToInput(event.endDate),
      multiDay: Boolean(event.endDate),
      venueName: event.venueName ?? "",
      venueCity: event.venueCity ?? "",
      expectedGuests:
        event.expectedGuests != null ? String(event.expectedGuests) : "",
      welcomeMessage:
        event.welcomeMessage || t(`guest__welcome_default__${config.type}`),
      themeColor: event.themeColor,
      slug: event.slug,
    },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const welcomeMessage = useWatch({ control, name: "welcomeMessage" }) ?? "";
  const multiDay = useWatch({ control, name: "multiDay" }) ?? false;
  const slugValue = useWatch({ control, name: "slug" }) ?? "";
  const themeColorValue = useWatch({ control, name: "themeColor" });
  const [copied, setCopied] = useState(false);

  const handleCopyPublicLink = async () => {
    const url = `${env.APP_URL}/${slugValue}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const onSubmit = async (values: WeddingFields) => {
    try {
      const { event: updated } = await eventsClient.update(event.id, {
        partnerAName: values.partnerAName,
        partnerBName: values.partnerBName || undefined,
        weddingDate: values.weddingDate || undefined,
        endDate: values.endDate || null,
        venueName: values.venueName || undefined,
        venueCity: values.venueCity || undefined,
        expectedGuests: values.expectedGuests
          ? Number(values.expectedGuests)
          : undefined,
        welcomeMessage: values.welcomeMessage || undefined,
        themeColor: values.themeColor || undefined,
        slug: values.slug || undefined,
        ...(showEventName
          ? { details: { eventName: values.eventName?.trim() || "" } }
          : {}),
      });
      const updatedDetails = (updated.details ?? {}) as Record<string, unknown>;
      reset({
        partnerAName: updated.partnerAName ?? "",
        partnerBName: updated.partnerBName ?? "",
        eventName:
          typeof updatedDetails.eventName === "string"
            ? updatedDetails.eventName
            : "",
        weddingDate: eventDateToInput(updated.weddingDate),
        endDate: eventDateToInput(updated.endDate),
        multiDay: Boolean(updated.endDate),
        venueName: updated.venueName ?? "",
        venueCity: updated.venueCity ?? "",
        expectedGuests:
          updated.expectedGuests != null ? String(updated.expectedGuests) : "",
        welcomeMessage: updated.welcomeMessage ?? "",
        themeColor: updated.themeColor,
        slug: updated.slug,
      });
      toast.success(t("settings__wedding__saved"));
      router.refresh();
    } catch (error) {
      toast.error(
        ApiError.isApiError(error)
          ? error.message
          : t("settings__wedding__save_error"),
      );
    }
  };

  // Highlight and scroll to the first invalid field instead of dumping a
  // developer-facing error string; per-field messages carry the detail.
  const onInvalid = (formErrors: FieldErrors<WeddingFields>) => {
    scrollToFirstError(formErrors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
      <EventThemePreview
        themeColor={themeColorValue ?? event.themeColor}
        eventType={typeOverride ?? event.eventType}
      />
      <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
        <SettingsField
          label={labelForColumn("hostAName", "settings__wedding__partnerA")}
          fieldName="partnerAName"
        >
          <Input
            type="text"
            placeholder={t("settings__wedding__placeholder_partner_a")}
            aria-invalid={Boolean(errors.partnerAName)}
            className={invalidFieldClass}
            {...register("partnerAName")}
          />
          {errors.partnerAName && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.partnerAName.message}
            </span>
          )}
        </SettingsField>
        {hasSecondHost && (
          <SettingsField
            label={labelForColumn("hostBName", "settings__wedding__partnerB")}
            fieldName="partnerBName"
          >
            <Input
              type="text"
              placeholder={t("settings__wedding__placeholder_partner_b")}
              aria-invalid={Boolean(errors.partnerBName)}
              className={invalidFieldClass}
              {...register("partnerBName")}
            />
            {errors.partnerBName && (
              <span className="type-caption text-destructive mt-1.5 block">
                {errors.partnerBName.message}
              </span>
            )}
          </SettingsField>
        )}
      </div>

      {showEventName && (
        <div className="mt-5">
          <SettingsField
            label={t("event__field__event_name")}
            fieldName="eventName"
          >
            <Input
              type="text"
              placeholder={t("event__field__event_name_placeholder")}
              aria-invalid={Boolean(errors.eventName)}
              className={invalidFieldClass}
              {...register("eventName")}
            />
            {errors.eventName && (
              <span className="type-caption text-destructive mt-1.5 block">
                {errors.eventName.message}
              </span>
            )}
          </SettingsField>
        </div>
      )}

      {extraFields && <div className="mt-5">{extraFields}</div>}

      <div className="mt-5">
        <SettingsField
          label={t(config.nounKeys.dateLabel)}
          fieldName="weddingDate"
        >
          <Controller
            control={control}
            name="weddingDate"
            render={({ field }) => (
              <DateFieldControl
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={t("signup__book_details__date_placeholder")}
                invalid={Boolean(errors.weddingDate)}
              />
            )}
          />
          {errors.weddingDate && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.weddingDate.message}
            </span>
          )}
        </SettingsField>
      </div>

      {showEndDate && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="type-body-small text-foreground font-medium">
            {t("invitation__field__multi_day")}
          </span>
          <Controller
            control={control}
            name="multiDay"
            render={({ field }) => (
              <Switch
                checked={Boolean(field.value)}
                onChange={(v) => {
                  field.onChange(v);
                  if (!v) setValue("endDate", "");
                }}
              />
            )}
          />
        </div>
      )}

      {showEndDate && multiDay && (
        <div className="mt-5">
          <SettingsField label={t(endDateLabel)} fieldName="endDate">
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DateFieldControl
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder={t("signup__book_details__date_placeholder")}
                  invalid={Boolean(errors.endDate)}
                />
              )}
            />
            {errors.endDate && (
              <span className="type-caption text-destructive mt-1.5 block">
                {errors.endDate.message}
              </span>
            )}
          </SettingsField>
        </div>
      )}

      <div className="tablet:grid-cols-2 mt-5 grid grid-cols-1 gap-6">
        <SettingsField
          label={labelForColumn(
            "locationName",
            "settings__wedding__venue_name",
          )}
          fieldName="venueName"
        >
          <Input
            type="text"
            placeholder={t("settings__wedding__venue_name_placeholder")}
            aria-invalid={Boolean(errors.venueName)}
            className={invalidFieldClass}
            {...register("venueName")}
          />
          {errors.venueName && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.venueName.message}
            </span>
          )}
        </SettingsField>
        <SettingsField
          label={labelForColumn(
            "locationCity",
            "settings__wedding__venue_city",
          )}
          fieldName="venueCity"
          adornmentRight={
            <MapPinIcon
              width={16}
              height={16}
              className="text-muted-foreground"
            />
          }
        >
          <Input
            type="text"
            placeholder={t("settings__wedding__venue_city_placeholder")}
            aria-invalid={Boolean(errors.venueCity)}
            className={invalidFieldClass}
            {...register("venueCity")}
          />
          {errors.venueCity && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.venueCity.message}
            </span>
          )}
        </SettingsField>
      </div>

      {showExpectedGuests && (
        <div className="mt-5">
          <SettingsField
            label={labelForColumn(
              "expectedGuests",
              "event__field__expected_guests",
            )}
            fieldName="expectedGuests"
          >
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              aria-invalid={Boolean(errors.expectedGuests)}
              className={invalidFieldClass}
              {...register("expectedGuests")}
            />
            {errors.expectedGuests && (
              <span className="type-caption text-destructive mt-1.5 block">
                {errors.expectedGuests.message}
              </span>
            )}
          </SettingsField>
        </div>
      )}

      <div className="mt-5">
        <SettingsField
          label={t("settings__wedding__welcome_note")}
          fieldName="welcomeMessage"
          hint={t("settings__wedding__welcome_note_hint", {
            count: welcomeMessage.length,
          })}
        >
          <textarea
            {...register("welcomeMessage")}
            aria-invalid={Boolean(errors.welcomeMessage)}
            placeholder={t(`et__${config.type}__tagline`)}
            rows={3}
            className={`border-border bg-card text-foreground type-body-small w-full rounded-lg border p-3 font-serif leading-relaxed outline-none ${invalidFieldClass}`}
          />
          {errors.welcomeMessage && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.welcomeMessage.message}
            </span>
          )}
        </SettingsField>
      </div>

      <div className="mt-5">
        <SettingsField
          label={t("settings__theme__label")}
          hint={t("settings__theme__hint")}
        >
          <Controller
            control={control}
            name="themeColor"
            render={({ field }) => (
              <ThemeColorField
                value={field.value ?? event.themeColor}
                onChange={field.onChange}
                eventType={typeOverride ?? event.eventType}
              />
            )}
          />
        </SettingsField>
      </div>

      <div className="tablet:grid-cols-2 mt-5 grid grid-cols-1 gap-6">
        <SettingsField
          label={t("settings__wedding__public_link")}
          fieldName="slug"
          hint={t("settings__wedding__public_link_hint")}
        >
          <div
            className={`bg-card flex h-10 items-center gap-2 rounded-lg border pr-1 pl-3 ${
              errors.slug
                ? "border-destructive ring-destructive ring-1"
                : "border-border"
            }`}
          >
            <span className="type-body-small text-muted-foreground">
              {env.APP_URL}/
            </span>
            <input
              type="text"
              aria-invalid={Boolean(errors.slug)}
              className="type-body-small text-foreground h-full min-w-0 flex-1 truncate bg-transparent outline-none"
              {...register("slug")}
            />
            <button
              type="button"
              onClick={handleCopyPublicLink}
              disabled={!slugValue}
              aria-label={t("settings__wedding__public_link_copy")}
              className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-7 shrink-0 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? (
                <CheckIcon width={16} height={16} className="text-secondary" />
              ) : (
                <CopyIcon width={16} height={16} />
              )}
            </button>
          </div>
          {errors.slug && (
            <span className="type-caption text-destructive mt-1.5 block">
              {errors.slug.message}
            </span>
          )}
        </SettingsField>
      </div>

      <div className="mt-6 flex justify-end gap-2.5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("settings__wedding__saving")
            : t("settings__wedding__save")}
        </Button>
      </div>
    </form>
  );
};
