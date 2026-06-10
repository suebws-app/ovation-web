type CompressOptions = {
  maxDimension?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
};

const SKIP_MIME = new Set(["image/gif", "image/heic", "image/heif"]);

export const compressImage = async (
  file: File,
  options: CompressOptions = {},
): Promise<File> => {
  const maxDimension = options.maxDimension ?? 4000;
  const quality = options.quality ?? 0.92;
  const mimeType = options.mimeType ?? "image/jpeg";

  if (!file.type.startsWith("image/")) return file;
  if (SKIP_MIME.has(file.type)) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode-failed"));
      el.src = url;
    });

    const { naturalWidth, naturalHeight } = img;
    if (!naturalWidth || !naturalHeight) return file;

    const longest = Math.max(naturalWidth, naturalHeight);
    const scale = longest > maxDimension ? maxDimension / longest : 1;
    const targetWidth = Math.round(naturalWidth * scale);
    const targetHeight = Math.round(naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), mimeType, quality),
    );
    if (!blob) return file;
    if (blob.size >= file.size) return file;

    const extension = mimeType === "image/webp" ? "webp" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.${extension}`, {
      type: mimeType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
};
