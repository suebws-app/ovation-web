const SAFE_PROTOCOLS = new Set(["https:", "http:"]);

const APP_RELATIVE_PATH = /^\/(?![/\\])/;

export const safeHttpUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (APP_RELATIVE_PATH.test(url)) return url;
  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? url : null;
  } catch {
    return null;
  }
};
