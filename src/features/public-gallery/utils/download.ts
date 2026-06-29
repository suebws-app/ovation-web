import { publicClient } from "@/lib/api/public-client";

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

// The API returns a presigned URL with Content-Disposition: attachment, so a
// plain anchor navigation downloads cross-origin without a CORS fetch.
export const downloadGalleryItem = async (
  slug: string,
  code: string,
  mediaId: string,
): Promise<void> => {
  const { url } = await publicClient.galleryDownloadUrl(slug, code, mediaId);
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
