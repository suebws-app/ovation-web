import { clientFetch } from "./client";
import type { KeepsakeCatalog } from "./types";

export type GoldBookPreviewInput = {
  messageIds: string[];
  layout?: "classic" | "modern" | "minimal";
  coverTitle: string;
  coverSubtitle?: string;
};

export type VideoMontagePreviewInput = {
  messageIds: string[];
  style?: "cinematic" | "party" | "emotional";
  musicTrackId?: string;
};

export type BindType = "hardcover" | "softcover" | "layflat";

export type KeepsakePreviewInput = {
  eventId: string;
  productType: BindType;
  productVariantId?: string;
  photoIds: string[];
  photoSelectAll?: {
    filter: "all" | "favorites" | "gold_book";
    excludedIds: string[];
  };
  messageIds?: string[];
  customization?: {
    coverTitle?: string;
    coverSubtitle?: string;
    dedication?: string;
    coverImageMediaId?: string;
    coverTemplateId?: string;
    coverSlots?: { slotId: string; mediaId: string }[];
    coverBgColor?: string;
    coverTextColors?: Record<string, string>;
    interiorDensity?: "spacious" | "balanced" | "asymmetrical";
    showMessages?: boolean;
  };
};

export type RenderStatus = {
  id: string;
  orderId: string | null;
  renderType: "preview" | "final";
  status: "queued" | "rendering" | "completed" | "failed";
  bindType?: string | null;
  publicUrl?: string;
  contentUrl?: string | null;
  errorMessage?: string | null;
  pageCount?: number | null;
  createdAt: string;
};

export const keepsakesClient = {
  catalog: () => clientFetch<KeepsakeCatalog>("/keepsakes/catalog"),

  goldBookPreview: (eventId: string, input: GoldBookPreviewInput) =>
    clientFetch<{ jobId: string }>(
      `/events/${eventId}/keepsakes/gold-book/preview`,
      { method: "POST", body: input },
    ),

  videoMontagePreview: (eventId: string, input: VideoMontagePreviewInput) =>
    clientFetch<{ jobId: string }>(
      `/events/${eventId}/keepsakes/video-montage/preview`,
      { method: "POST", body: input },
    ),

  createKeepsakePreview: (input: KeepsakePreviewInput) =>
    clientFetch<{ renderId: string }>("/pdf/keepsakes/preview", {
      method: "POST",
      body: input,
    }),

  getRender: (renderId: string) =>
    clientFetch<RenderStatus>(`/pdf/renders/${renderId}`),
};
