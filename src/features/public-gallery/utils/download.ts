const extFromUrl = (url: string, fallback: string): string => {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\.([a-zA-Z0-9]{2,5})$/);
    return m ? m[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
};

export const videoMimeFromUrl = (url: string): "video/mp4" | "video/webm" =>
  extFromUrl(url, "mp4") === "webm" ? "video/webm" : "video/mp4";

const sanitizeFilename = (s: string): string =>
  s.replace(/[^\p{L}\p{N}\-_ ]+/gu, "").trim() || "photo";

export const downloadGalleryItem = async (
  url: string,
  name: string,
  isVideo: boolean,
): Promise<void> => {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const ext = extFromUrl(url, isVideo ? "mp4" : "jpg");
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = `${sanitizeFilename(name)}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
