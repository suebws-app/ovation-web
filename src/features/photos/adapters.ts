import {
  initialsFrom,
  tintFrom,
  formatTimeShort,
  formatDurationShort,
} from "@/features/messages/adapters";
import type { MessageSummary } from "@/lib/api/types";

export type PhotoView = {
  id: string;
  thumbUrl: string | null;
  name: string;
  monogram: string;
  tint: string;
  favorited: boolean;
  hasAudio: boolean;
  audioDuration: string;
  audioDurationSec: number;
  time: string;
  createdAt: string;
};

const HEIGHTS = [260, 200, 300, 240, 220, 280, 340, 200];

export const heightFor = (index: number): number =>
  HEIGHTS[index % HEIGHTS.length]!;

export const toPhotoView = (
  m: MessageSummary,
  anonymousLabel: string,
): PhotoView => ({
  id: m.id,
  thumbUrl: m.photoThumbUrl,
  name: m.guestNames || anonymousLabel,
  monogram: initialsFrom(m.guestNames),
  tint: tintFrom(m.id),
  favorited: m.isFavorite,
  hasAudio: m.hasAudio,
  audioDuration: formatDurationShort(m.audioDurationSec),
  audioDurationSec: m.audioDurationSec ?? 0,
  time: formatTimeShort(m.createdAt),
  createdAt: m.createdAt,
});
