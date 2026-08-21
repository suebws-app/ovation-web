const STORAGE_KEY = "ovation.guest.device";

const mintId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `d-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const guestDeviceId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const created = mintId();
    window.localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    return null;
  }
};

export const guestDeviceHeaders = (): Record<string, string> => {
  const id = guestDeviceId();
  return id ? { "X-Guest-Device": id } : {};
};
