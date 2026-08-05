export type VideoMime = "video/mp4" | "video/webm";

const extFromUrl = (url: string): string => {
  const clean = url.split("?")[0]?.split("#")[0] ?? url;
  const idx = clean.lastIndexOf(".");
  return idx === -1 ? "" : clean.slice(idx + 1).toLowerCase();
};

export const videoMimeFromUrl = (url: string): VideoMime =>
  extFromUrl(url) === "webm" ? "video/webm" : "video/mp4";

export const videoMimeFromType = (mimeType: string): VideoMime =>
  mimeType.toLowerCase().includes("mp4") ? "video/mp4" : "video/webm";
