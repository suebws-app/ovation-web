"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createZipBlob } from "@/lib/media/createZip";
import { createXlsxBlob, type XlsxSheet } from "@/lib/spreadsheet/createXlsx";
import { messagesClient } from "@/lib/api/messages-client";
import type {
  Event,
  MessageDetail,
  MessageSummary,
  GalleryItem,
} from "@/lib/api/types";
import { aggregateGuests, type GuestRow } from "@/features/guests/adapters";

export type ExportKind =
  | "audio"
  | "transcripts"
  | "photos"
  | "guests"
  | "everything"
  | "allEventsExcel";

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const escapeCsv = (value: string): string => {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
};

const buildGuestsCsv = (guests: GuestRow[]): string => {
  const header = [
    "Guest",
    "Messages",
    "Audio",
    "Photos",
    "Videos",
    "Favourited",
    "First contribution",
    "Last contribution",
  ];
  const rows = guests.map((g) => [
    g.name,
    String(g.messageCount),
    String(g.audioCount),
    String(g.photoCount),
    String(g.videoCount),
    g.isFavorite ? "yes" : "no",
    g.firstAt,
    g.lastAt,
  ]);
  return [header, ...rows]
    .map((cols) => cols.map(escapeCsv).join(","))
    .join("\n");
};

const formatDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const safeName = (input: string): string =>
  input
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim() || "untitled";

const extensionFromUrl = (url: string, fallback: string): string => {
  const path = url.split("?")[0];
  const match = /\.([a-z0-9]{2,5})$/i.exec(path);
  return match ? match[1].toLowerCase() : fallback;
};

const fetchAllSummaries = async (
  eventId: string,
): Promise<MessageSummary[]> => {
  const all: MessageSummary[] = [];
  let cursor: string | undefined;
  do {
    const page = await messagesClient.list(eventId, {
      limit: 100,
      cursor,
      includeOwnerUploads: true,
    });
    all.push(...page.items);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return all;
};

const fetchDetails = async (
  eventId: string,
  ids: string[],
): Promise<MessageDetail[]> => {
  const results: MessageDetail[] = [];
  const concurrency = 6;
  let i = 0;
  while (i < ids.length) {
    const slice = ids.slice(i, i + concurrency);
    const detailed = await Promise.all(
      slice.map((id) =>
        messagesClient.get(eventId, id).then((r) => r.message),
      ),
    );
    results.push(...detailed);
    i += concurrency;
  }
  return results;
};

const fetchBlob = async (url: string): Promise<Blob | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
};

const buildAudioFiles = async (
  details: MessageDetail[],
): Promise<{ name: string; blob: Blob }[]> => {
  const files: { name: string; blob: Blob }[] = [];
  for (const m of details) {
    if (!m.audioUrl) continue;
    const blob = await fetchBlob(m.audioUrl);
    if (!blob) continue;
    const ext = extensionFromUrl(
      m.audioUrl,
      (m.audioMimeType ?? "audio/webm").split("/")[1] ?? "webm",
    );
    files.push({
      name: `${safeName(m.guestNames || m.id)}-${m.id}.${ext}`,
      blob,
    });
  }
  return files;
};

const buildPhotoFiles = async (
  details: MessageDetail[],
): Promise<{ name: string; blob: Blob }[]> => {
  const items: { item: GalleryItem; guest: string }[] = [];
  for (const m of details) {
    for (const media of m.media) {
      if (media.type !== "photo" || !media.url) continue;
      items.push({ item: media, guest: m.guestNames || m.id });
    }
  }
  const files: { name: string; blob: Blob }[] = [];
  for (const { item, guest } of items) {
    if (!item.url) continue;
    const blob = await fetchBlob(item.url);
    if (!blob) continue;
    const ext = extensionFromUrl(item.url, "jpg");
    files.push({
      name: `${safeName(guest)}-${item.id}.${ext}`,
      blob,
    });
  }
  return files;
};

const buildVideoFiles = async (
  details: MessageDetail[],
): Promise<{ name: string; blob: Blob }[]> => {
  const items: { item: GalleryItem; guest: string }[] = [];
  for (const m of details) {
    for (const media of m.media) {
      if (media.type !== "video" || !media.url) continue;
      items.push({ item: media, guest: m.guestNames || m.id });
    }
  }
  const files: { name: string; blob: Blob }[] = [];
  for (const { item, guest } of items) {
    if (!item.url) continue;
    const blob = await fetchBlob(item.url);
    if (!blob) continue;
    const ext = extensionFromUrl(item.url, "mp4");
    files.push({
      name: `${safeName(guest)}-${item.id}.${ext}`,
      blob,
    });
  }
  return files;
};

const buildTranscriptsText = (details: MessageDetail[]): string => {
  const blocks: string[] = [];
  for (const m of details) {
    const lines: string[] = [];
    lines.push(`# ${m.guestNames || "Anonymous"}`);
    lines.push(`Date: ${m.createdAt}`);
    if (m.transcript) {
      lines.push("");
      lines.push("Transcript:");
      lines.push(m.transcript);
    }
    if (m.writtenNote) {
      lines.push("");
      lines.push("Written note:");
      lines.push(m.writtenNote);
    }
    if (m.transcript || m.writtenNote) blocks.push(lines.join("\n"));
  }
  return blocks.join("\n\n---\n\n");
};

const buildGuestSheet = (event: Event, guests: GuestRow[]): XlsxSheet => {
  const coupleName = [event.partnerAName, event.partnerBName]
    .filter(Boolean)
    .join(" & ");
  const rows: (string | number | boolean | null)[][] = [];
  rows.push(["Event", coupleName]);
  rows.push(["Date", event.weddingDate ?? ""]);
  rows.push(["Venue", event.venueName ?? ""]);
  rows.push(["City", event.venueCity ?? ""]);
  rows.push(["Slug", event.slug]);
  rows.push([]);
  rows.push([
    "Guest",
    "Messages",
    "Audio count",
    "Photos count",
    "Videos count",
    "Has audio",
    "Has photo",
    "Has video",
    "Favourited",
    "First contribution",
    "Last contribution",
  ]);
  for (const g of guests) {
    rows.push([
      g.name,
      g.messageCount,
      g.audioCount,
      g.photoCount,
      g.videoCount,
      g.hasAudio ? "yes" : "no",
      g.hasPhoto ? "yes" : "no",
      g.hasVideo ? "yes" : "no",
      g.isFavorite ? "yes" : "no",
      g.firstAt,
      g.lastAt,
    ]);
  }
  return { name: coupleName || event.slug || "Event", rows };
};

type UseEventDataExportOptions = {
  events?: Event[];
};

export const useEventDataExport = (
  eventId: string | null,
  options: UseEventDataExportOptions = {},
) => {
  const t = useTranslations();
  const anonymous = t("common__anonymous");
  const [pending, setPending] = useState<ExportKind | null>(null);

  const run = async (kind: ExportKind) => {
    if (pending) return;

    if (kind === "allEventsExcel") {
      const events = options.events ?? [];
      if (events.length === 0) return;
      setPending(kind);
      try {
        const sheets: XlsxSheet[] = [];
        for (const ev of events) {
          const summaries = await fetchAllSummaries(ev.id);
          const guests = aggregateGuests(summaries, anonymous);
          sheets.push(buildGuestSheet(ev, guests));
        }
        const blob = createXlsxBlob(sheets);
        triggerDownload(blob, `events ${formatDate(new Date())}.xlsx`);
      } finally {
        setPending(null);
      }
      return;
    }

    if (!eventId) return;
    setPending(kind);
    try {
      const summaries = await fetchAllSummaries(eventId);
      const dateStamp = formatDate(new Date());

      if (kind === "guests") {
        const guests = aggregateGuests(summaries, anonymous);
        const csv = buildGuestsCsv(guests);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        triggerDownload(blob, `guests ${dateStamp}.csv`);
        return;
      }

      const needDetails =
        kind === "audio" ||
        kind === "transcripts" ||
        kind === "photos" ||
        kind === "everything";

      const details = needDetails
        ? await fetchDetails(
            eventId,
            summaries.map((s) => s.id),
          )
        : [];

      if (kind === "audio") {
        const files = await buildAudioFiles(details);
        if (files.length === 0) return;
        const blob = await createZipBlob(files);
        triggerDownload(blob, `audio ${dateStamp}.zip`);
        return;
      }

      if (kind === "transcripts") {
        const text = buildTranscriptsText(details);
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        triggerDownload(blob, `transcripts ${dateStamp}.txt`);
        return;
      }

      if (kind === "photos") {
        const files = await buildPhotoFiles(details);
        if (files.length === 0) return;
        const blob = await createZipBlob(files);
        triggerDownload(blob, `photos ${dateStamp}.zip`);
        return;
      }

      if (kind === "everything") {
        const [audio, photos, videos] = await Promise.all([
          buildAudioFiles(details),
          buildPhotoFiles(details),
          buildVideoFiles(details),
        ]);
        const transcripts = buildTranscriptsText(details);
        const guests = aggregateGuests(summaries, anonymous);
        const csv = buildGuestsCsv(guests);
        const files: { name: string; blob: Blob }[] = [];
        for (const f of audio)
          files.push({ name: `audio/${f.name}`, blob: f.blob });
        for (const f of photos)
          files.push({ name: `photos/${f.name}`, blob: f.blob });
        for (const f of videos)
          files.push({ name: `videos/${f.name}`, blob: f.blob });
        files.push({
          name: "transcripts.txt",
          blob: new Blob([transcripts], { type: "text/plain;charset=utf-8" }),
        });
        files.push({
          name: "guests.csv",
          blob: new Blob([csv], { type: "text/csv;charset=utf-8" }),
        });
        const blob = await createZipBlob(files);
        triggerDownload(blob, `event-data ${dateStamp}.zip`);
        return;
      }
    } finally {
      setPending(null);
    }
  };

  return {
    run,
    pending,
    isBusy: pending !== null,
    isAvailable: Boolean(eventId),
  };
};
