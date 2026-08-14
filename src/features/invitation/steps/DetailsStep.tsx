"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getDateFnsLocale } from "@/lib/utils/dateFnsLocale";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Switch } from "@ovation/ui/components/Switch";
import { Calendar } from "@ovation/ui/components/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { cn } from "@ovation/ui/utils/cn";
import { toIsoDate, parseIsoDate } from "@/lib/utils/formatDate";
import {
  INVITATION_NAME_MAX,
  type InvitationFields,
} from "../invitationSchema";
import { TimePicker } from "../components/TimePicker";
import { getEventTypeConfig } from "@/lib/event-types";
import { DetailAssetUpload } from "@/features/settings/components/EventDetailsFields/DetailAssetUpload";

type DetailsStepProps = {
  eventType?: string | null;
  eventId?: string | null;
};

const formatNiceDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const DetailsStep = ({ eventType, eventId }: DetailsStepProps) => {
  const t = useTranslations();
  const uiLocale = useLocale();
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InvitationFields>();

  const config = getEventTypeConfig(eventType);
  const hostALabelKey =
    config.fields.find((f) => f.column === "hostAName")?.labelKey ??
    "invitation__field__partner_a";
  const hostBField = config.fields.find((f) => f.column === "hostBName");
  const startDateField = config.fields.find((f) => f.column === "eventDate");
  const endDateField = config.fields.find((f) => f.column === "endDate");
  const bornOnField = config.fields.find((f) => f.key === "bornOn");
  const passedOnField = config.fields.find((f) => f.key === "passedOn");
  const agendaField = config.fields.find((f) => f.key === "agenda");
  const attachAgenda = useWatch({ control, name: "attachAgenda" });
  const logoField = config.fields.find((f) => f.key === "logo");
  const showLogo = useWatch({ control, name: "showLogo" });
  const multiDay = useWatch({ control, name: "multiDay" });

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const yearField = (name: "bornOn" | "passedOn", labelKey: string) => (
    <div>
      <Label htmlFor={`inv-${name}`} className="mb-2">
        {t(labelKey)}
      </Label>
      <Input
        id={`inv-${name}`}
        type="number"
        inputMode="numeric"
        placeholder="YYYY"
        {...register(name)}
      />
    </div>
  );

  return (
    <>
      {!config.customNoun && (
        <div className="tablet:mt-7 mt-5">
          <Label htmlFor="inv-event-name" className="mb-2">
            {t("event__field__event_name")}
          </Label>
          <Input
            id="inv-event-name"
            maxLength={80}
            placeholder={t("event__field__event_name_placeholder")}
            {...register("eventName")}
          />
        </div>
      )}
      {config.customNoun && (
        <div className="tablet:mt-7 mt-5">
          <Label htmlFor="inv-custom-noun" className="mb-2">
            {t("event__field__custom_event_noun")}
          </Label>
          <Input
            id="inv-custom-noun"
            maxLength={40}
            placeholder={t("event__field__custom_event_noun_placeholder")}
            {...register("customEventNoun")}
          />
        </div>
      )}
      {config.features.rsvp && (
        <div className="tablet:mt-6 mt-4 flex items-center justify-between gap-3">
          <Label htmlFor="inv-show-rsvp">
            {t("invitation__field__allow_rsvp")}
          </Label>
          <Controller
            control={control}
            name="showRsvp"
            render={({ field }) => (
              <Switch
                id="inv-show-rsvp"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      )}
      {agendaField && eventId && (
        <div className="tablet:mt-6 mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="inv-attach-agenda">
              {t("invitation__field__attach_agenda")}
            </Label>
            <Controller
              control={control}
              name="attachAgenda"
              render={({ field }) => (
                <Switch
                  id="inv-attach-agenda"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          {attachAgenda && (
            <Controller
              control={control}
              name="agenda"
              render={({ field }) => (
                <DetailAssetUpload
                  eventId={eventId}
                  field="agenda"
                  label={t(agendaField.labelKey)}
                  kind="file"
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              )}
            />
          )}
        </div>
      )}
      {logoField && eventId && (
        <div className="tablet:mt-6 mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="inv-show-logo">
              {t("invitation__field__show_logo")}
            </Label>
            <Controller
              control={control}
              name="showLogo"
              render={({ field }) => (
                <Switch
                  id="inv-show-logo"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          {showLogo && (
            <Controller
              control={control}
              name="logo"
              render={({ field }) => (
                <DetailAssetUpload
                  eventId={eventId}
                  field="logo"
                  label={t(logoField.labelKey)}
                  kind="image"
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              )}
            />
          )}
        </div>
      )}
      {eventType === "birthday" && (
        <div className="tablet:mt-6 mt-4">
          <Label htmlFor="inv-age" className="mb-2">
            {t("event__field__turning_age")}
          </Label>
          <Input
            id="inv-age"
            type="number"
            inputMode="numeric"
            min={0}
            max={150}
            placeholder={t("event__field__turning_age")}
            {...register("age")}
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <Label htmlFor="inv-show-age">
              {t("invitation__field__show_age")}
            </Label>
            <Controller
              control={control}
              name="showAge"
              render={({ field }) => (
                <Switch
                  id="inv-show-age"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      )}
      <div className="tablet:mt-6 tablet:grid-cols-[1fr_auto_1fr] mt-4 grid grid-cols-1 items-start gap-3.5">
        <div>
          <Label htmlFor="inv-partner-a" className="mb-2">
            {t(hostALabelKey)}
          </Label>
          <Input
            id="inv-partner-a"
            maxLength={INVITATION_NAME_MAX}
            placeholder={t("invitation__placeholder__partner_a")}
            aria-invalid={Boolean(errors.partnerA)}
            {...register("partnerA")}
          />
          {errors.partnerA?.message && (
            <span className="type-caption text-destructive mt-1 block">
              {errors.partnerA.message}
            </span>
          )}
        </div>
        {hostBField && (
          <span className="text-muted-foreground type-h1 tablet:flex mt-7 hidden h-10 items-center italic">
            &amp;
          </span>
        )}
        {hostBField && (
          <div>
            <Label htmlFor="inv-partner-b" className="mb-2">
              {t(hostBField.labelKey)}
            </Label>
            <Input
              id="inv-partner-b"
              maxLength={INVITATION_NAME_MAX}
              placeholder={t("invitation__placeholder__partner_b")}
              aria-invalid={Boolean(errors.partnerB)}
              {...register("partnerB")}
            />
            {errors.partnerB?.message && (
              <span className="type-caption text-destructive mt-1 block">
                {errors.partnerB.message}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="tablet:mt-6 tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
        <div>
          <Label className="mb-2 block">
            {endDateField && startDateField
              ? t(startDateField.labelKey)
              : t("invitation__field__date")}
          </Label>
          <Controller
            control={control}
            name="weddingDate"
            render={({ field }) => {
              const selected = parseIsoDate(field.value);
              return (
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring hover:border-primary/40 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <CalendarIcon
                        width={16}
                        height={16}
                        className="text-primary shrink-0"
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          selected ? "font-medium" : "text-muted-foreground",
                        )}
                      >
                        {selected
                          ? formatNiceDate(selected)
                          : t("invitation__placeholder__date")}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="rounded-16 w-auto p-3"
                  >
                    <Calendar
                      mode="single"
                      locale={getDateFnsLocale(uiLocale)}
                      selected={selected}
                      onSelect={(date) => {
                        field.onChange(date ? toIsoDate(date) : "");
                        setDatePickerOpen(false);
                      }}
                      disabled={{ before: new Date() }}
                      className="mx-auto"
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </div>
        <div>
          <Label className="mb-2 block">{t("invitation__field__time")}</Label>
          <Controller
            control={control}
            name="time"
            render={({ field }) => (
              <TimePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      {endDateField && (
        <div className="tablet:mt-6 mt-4 flex items-center justify-between gap-3">
          <Label htmlFor="inv-multi-day">
            {t("invitation__field__multi_day")}
          </Label>
          <Controller
            control={control}
            name="multiDay"
            render={({ field }) => (
              <Switch
                id="inv-multi-day"
                checked={field.value}
                onChange={(v) => {
                  field.onChange(v);
                  if (!v) setValue("endDate", "");
                }}
              />
            )}
          />
        </div>
      )}
      {endDateField && multiDay && (
        <div className="tablet:mt-4 mt-4">
          <Label className="mb-2 block">{t(endDateField.labelKey)}</Label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => {
              const selected = parseIsoDate(field.value);
              return (
                <Popover
                  open={endDatePickerOpen}
                  onOpenChange={setEndDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring hover:border-primary/40 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <CalendarIcon
                        width={16}
                        height={16}
                        className="text-primary shrink-0"
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          selected ? "font-medium" : "text-muted-foreground",
                        )}
                      >
                        {selected
                          ? formatNiceDate(selected)
                          : t("invitation__placeholder__date")}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="rounded-16 w-auto p-3"
                  >
                    <Calendar
                      mode="single"
                      locale={getDateFnsLocale(uiLocale)}
                      selected={selected}
                      onSelect={(date) => {
                        field.onChange(date ? toIsoDate(date) : "");
                        setEndDatePickerOpen(false);
                      }}
                      disabled={{ before: new Date() }}
                      className="mx-auto"
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </div>
      )}

      {bornOnField && passedOnField && (
        <div className="tablet:mt-4 tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
          {yearField("bornOn", bornOnField.labelKey)}
          {yearField("passedOn", passedOnField.labelKey)}
        </div>
      )}

      <div className="tablet:mt-4 tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
        <div>
          <Label htmlFor="inv-venue" className="mb-2">
            {t("invitation__field__venue")}
          </Label>
          <Input
            id="inv-venue"
            placeholder={t("invitation__placeholder__venue")}
            {...register("venue")}
          />
        </div>
        <div>
          <Label htmlFor="inv-place" className="mb-2">
            {t("invitation__field__place")}
          </Label>
          <Input
            id="inv-place"
            placeholder={t("invitation__placeholder__place")}
            {...register("place")}
          />
        </div>
      </div>

      <div className="tablet:mt-6 mt-4">
        <Label htmlFor="inv-message" className="mb-2">
          {t("invitation__field__message")}
        </Label>
        <textarea
          id="inv-message"
          rows={3}
          placeholder={t(`et__${config.type}__tagline`)}
          className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring tablet:text-sm w-full resize-none rounded-lg border px-3 py-2 text-base focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...register("message")}
        />
      </div>

      <div className="tablet:mt-6 mt-4">
        <Label htmlFor="inv-greeting" className="mb-2">
          {t("invitation__field__greeting")}
        </Label>
        <Input
          id="inv-greeting"
          maxLength={40}
          placeholder={t("invitation__placeholder__greeting")}
          {...register("greeting")}
        />
      </div>
    </>
  );
};
