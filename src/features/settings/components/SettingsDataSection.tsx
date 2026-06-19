"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ovation/ui/components/Select";
import type { Event } from "@/lib/api/types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { ExportHeroCard } from "./ExportHeroCard";
import {
  useEventDataExport,
  type ExportKind,
} from "../hooks/useEventDataExport";
import { coupleNameOf } from "@/lib/utils/eventFormatters";

type IndividualEntry = {
  titleKey: string;
  descKey: string;
  kind: ExportKind | null;
};

const INDIVIDUAL_ENTRIES: IndividualEntry[] = [
  {
    titleKey: "settings__data__individual__audio__title",
    descKey: "settings__data__individual__audio__desc",
    kind: "audio",
  },
  {
    titleKey: "settings__data__individual__transcripts__title",
    descKey: "settings__data__individual__transcripts__desc",
    kind: "transcripts",
  },
  {
    titleKey: "settings__data__individual__photos__title",
    descKey: "settings__data__individual__photos__desc",
    kind: "photos",
  },
  {
    titleKey: "settings__data__individual__guests__title",
    descKey: "settings__data__individual__guests__desc",
    kind: "guests",
  },
];

type SettingsDataSectionProps = {
  events: Event[];
  initialEventId: string | null;
  isPro: boolean;
};

export const SettingsDataSection = ({
  events,
  initialEventId,
  isPro,
}: SettingsDataSectionProps) => {
  const t = useTranslations();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    initialEventId,
  );
  const { run, pending, isBusy, isAvailable } = useEventDataExport(
    selectedEventId,
    { events },
  );

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? null,
    [events, selectedEventId],
  );

  const eventLabel = selectedEvent
    ? coupleNameOf(selectedEvent.partnerAName, selectedEvent.partnerBName) ||
      selectedEvent.slug
    : null;

  const savedScrollRef = useRef(0);
  const handleSelectOpenChange = (open: boolean) => {
    if (open) {
      savedScrollRef.current = window.scrollY;
    } else {
      const target = savedScrollRef.current;
      requestAnimationFrame(() => window.scrollTo(0, target));
    }
  };

  return (
    <>
      <span className="type-overline text-primary">
        {t("settings__data__eyebrow")}
      </span>
      <h1 className="type-h0 mt-2 tracking-tight">
        {t("settings__data__title_a")}{" "}
        <span className="text-primary italic">
          {t("settings__data__title_b")}
        </span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        {t("settings__data__subtitle")}
      </p>

      {isPro && events.length > 0 && (
        <div className="mt-8">
          <SettingsSectionTitle
            title={t("settings__data__all_events__title")}
            description={t("settings__data__all_events__desc")}
          />
          <SettingsCard>
            <SettingsRow
              title={t("settings__data__all_events__row_title")}
              description={t("settings__data__all_events__row_desc", {
                count: events.length,
              })}
              last
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={isBusy}
                onClick={() => run("allEventsExcel")}
              >
                <BoxIcon width={13} height={13} />
                {pending === "allEventsExcel"
                  ? t("common__loading")
                  : t("settings__data__all_events__cta")}
              </Button>
            </SettingsRow>
          </SettingsCard>
        </div>
      )}

      <div className="mt-9">
        <SettingsSectionTitle
          title={t("settings__data__per_event__title")}
          description={t("settings__data__per_event__desc")}
        />
        <div className="rounded-12 border-border bg-card tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-2 border px-4 py-3">
          <div className="min-w-0">
            <div className="type-caption text-muted-foreground">
              {t("settings__data__active_event")}
            </div>
            <div className="type-body-small truncate font-semibold">
              {eventLabel ?? "—"}
              {selectedEvent?.weddingDate && (
                <span className="text-muted-foreground ml-2 font-normal">
                  · {selectedEvent.weddingDate}
                </span>
              )}
            </div>
          </div>
          {events.length > 1 && (
            <Select
              value={selectedEventId ?? undefined}
              onValueChange={(v) => setSelectedEventId(v)}
              onOpenChange={handleSelectOpenChange}
            >
              <SelectTrigger className="min-w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-72">
                {events.map((ev) => (
                  <SelectItem key={ev.id} value={ev.id}>
                    {coupleNameOf(ev.partnerAName, ev.partnerBName) || ev.slug}
                    {ev.weddingDate ? ` · ${ev.weddingDate}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <ExportHeroCard
          onDownload={() => run("everything")}
          disabled={!isAvailable || isBusy}
          loading={pending === "everything"}
          eventLabel={eventLabel}
        />

        <div className="mt-6">
          <SettingsCard>
            {INDIVIDUAL_ENTRIES.map((entry, i) => {
              const disabled = entry.kind === null || !isAvailable || isBusy;
              const loading = entry.kind !== null && pending === entry.kind;
              return (
                <SettingsRow
                  key={entry.titleKey}
                  title={t(entry.titleKey)}
                  description={t(entry.descKey)}
                  last={i === INDIVIDUAL_ENTRIES.length - 1}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={disabled}
                    onClick={() => {
                      if (entry.kind) run(entry.kind);
                    }}
                  >
                    <BoxIcon width={13} height={13} />
                    {loading
                      ? t("common__loading")
                      : t("settings__data__download")}
                  </Button>
                </SettingsRow>
              );
            })}
          </SettingsCard>
        </div>
      </div>
    </>
  );
};
