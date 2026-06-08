import type { StateStorage } from "zustand/middleware";

export type TTLStorageOptions = {
  ttlMs: number;
};

type Envelope = {
  value: string;
  expiresAt: number;
};

const parseEnvelope = (raw: string | null): Envelope | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "value" in parsed &&
      "expiresAt" in parsed &&
      typeof (parsed as Envelope).value === "string" &&
      typeof (parsed as Envelope).expiresAt === "number"
    ) {
      return parsed as Envelope;
    }
  } catch {
    return null;
  }
  return null;
};

export const createTTLLocalStorage = ({
  ttlMs,
}: TTLStorageOptions): StateStorage => ({
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    try {
      const envelope = parseEnvelope(window.localStorage.getItem(name));
      if (!envelope) return null;
      if (Date.now() > envelope.expiresAt) {
        window.localStorage.removeItem(name);
        return null;
      }
      return envelope.value;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    try {
      const existing = parseEnvelope(window.localStorage.getItem(name));
      const expiresAt =
        existing && Date.now() <= existing.expiresAt
          ? existing.expiresAt
          : Date.now() + ttlMs;
      const envelope: Envelope = { value, expiresAt };
      window.localStorage.setItem(name, JSON.stringify(envelope));
    } catch {
      return;
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      return;
    }
  },
});
