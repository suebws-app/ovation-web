const SAFE_PROTOCOLS = new Set(["https:", "http:"]);

export const safeHttpUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? url : null;
  } catch {
    return null;
  }
};
