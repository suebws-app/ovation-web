const storageKey = (slug: string) => `ovation.guest.name.${slug}`;

export const readStoredGuestName = (slug: string): string | null => {
  try {
    return window.localStorage.getItem(storageKey(slug));
  } catch {
    return null;
  }
};

export const writeStoredGuestName = (slug: string, name: string) => {
  try {
    window.localStorage.setItem(storageKey(slug), name);
  } catch {
    return;
  }
};

export const clearStoredGuestName = (slug: string) => {
  try {
    window.localStorage.removeItem(storageKey(slug));
  } catch {
    return;
  }
};
