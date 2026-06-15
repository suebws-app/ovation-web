export const getOrigin = (fallback = ""): string =>
  typeof window !== "undefined" ? window.location.origin : fallback;
