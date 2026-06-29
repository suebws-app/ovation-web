import { create } from "zustand";

export type AudioCapture = {
  blob: Blob;
  url: string;
  durationSec: number;
  mimeType: string;
};

export type VideoCapture = {
  blob: Blob;
  url: string;
  durationSec: number;
  mimeType: string;
};

export type PhotoCapture = {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
};

export const MAX_PHOTOS = 5;

type GuestSubmissionState = {
  slug: string | null;
  sessionStartAt: number | null;
  guestName: string;
  inviteToken: string | null;
  audio: AudioCapture | null;
  video: VideoCapture | null;
  note: string;
  photos: PhotoCapture[];
  setSlug: (slug: string) => void;
  setGuestName: (name: string) => void;
  setInviteToken: (token: string | null) => void;
  setAudio: (audio: AudioCapture | null) => void;
  setVideo: (video: VideoCapture | null) => void;
  setNote: (note: string) => void;
  addPhotos: (photos: PhotoCapture[]) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  hasAnyContent: () => boolean;
  reset: () => void;
};

const initial = {
  slug: null,
  sessionStartAt: null,
  guestName: "",
  inviteToken: null,
  audio: null,
  video: null,
  note: "",
  photos: [] as PhotoCapture[],
} as const;

const revoke = (url: string | undefined) => {
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
};

export const useGuestSubmissionStore = create<GuestSubmissionState>(
  (set, get) => ({
    ...initial,
    setSlug: (slug) => {
      const current = get().slug;
      if (current && current !== slug) {
        revoke(get().audio?.url);
        revoke(get().video?.url);
        get().photos.forEach((p) => revoke(p.url));
        set({ ...initial, slug, sessionStartAt: Date.now() });
      } else {
        set({
          slug,
          sessionStartAt: get().sessionStartAt ?? Date.now(),
        });
      }
    },
    setGuestName: (guestName) => set({ guestName }),
    setInviteToken: (inviteToken) => set({ inviteToken }),
    setAudio: (audio) => {
      revoke(get().audio?.url);
      set({ audio });
    },
    setVideo: (video) => {
      revoke(get().video?.url);
      set({ video });
    },
    setNote: (note) => set({ note }),
    addPhotos: (incoming) => {
      const current = get().photos;
      const available = MAX_PHOTOS - current.length;
      if (available <= 0) {
        incoming.forEach((p) => revoke(p.url));
        return;
      }
      set({ photos: [...current, ...incoming.slice(0, available)] });
    },
    removePhoto: (id) => {
      const current = get().photos;
      const target = current.find((p) => p.id === id);
      if (target) revoke(target.url);
      set({ photos: current.filter((p) => p.id !== id) });
    },
    clearPhotos: () => {
      get().photos.forEach((p) => revoke(p.url));
      set({ photos: [] });
    },
    hasAnyContent: () => {
      const { audio, video, note, photos } = get();
      return (
        Boolean(audio || video) || photos.length > 0 || note.trim().length > 0
      );
    },
    reset: () => {
      revoke(get().audio?.url);
      revoke(get().video?.url);
      get().photos.forEach((p) => revoke(p.url));
      set({ ...initial });
    },
  }),
);
