import {
  initialsFrom,
  tintFrom,
  formatTimeShort,
} from "@/features/messages/adapters";
import type { GalleryItem } from "@/lib/api/types";

export type PhotoView = {
  id: string;
  mediaId: string;
  messageId: string | null;
  uploaderType: "guest" | "owner";
  type: "photo" | "video";
  thumbUrl: string | null;
  fullUrl: string | null;
  name: string;
  monogram: string;
  tint: string;
  favorited: boolean;
  inGoldBook: boolean;
  hasAudio: boolean;
  audioDuration: string;
  audioDurationSec: number;
  time: string;
  createdAt: string;
};

const HEIGHTS = [260, 200, 300, 240, 220, 280, 340, 200];

export const heightFor = (index: number): number =>
  HEIGHTS[index % HEIGHTS.length]!;

export const toPhotoViewFromGallery = (
  item: GalleryItem,
  anonymousLabel: string,
): PhotoView => {
  const name = item.uploaderName?.trim() || anonymousLabel;
  return {
    id: item.id,
    mediaId: item.id,
    messageId: item.messageId,
    uploaderType: item.uploaderType,
    type: item.type,
    thumbUrl: item.thumbUrl ?? item.url,
    fullUrl: item.url,
    name,
    monogram: initialsFrom(name),
    tint: tintFrom(item.id),
    favorited: item.isFavorite,
    inGoldBook: item.isGoldBookSelected,
    hasAudio: false,
    audioDuration: "",
    audioDurationSec: 0,
    time: formatTimeShort(item.createdAt),
    createdAt: item.createdAt,
  };
};
