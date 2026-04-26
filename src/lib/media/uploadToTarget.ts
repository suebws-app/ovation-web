import type { UploadTarget } from "@/lib/api/types";

export const uploadToTarget = async (
  target: UploadTarget,
  blob: Blob,
): Promise<void> => {
  if (target.fields) {
    const form = new FormData();
    for (const [k, v] of Object.entries(target.fields)) {
      form.append(k, v);
    }
    form.append("file", blob);
    const res = await fetch(target.url, { method: "POST", body: form });
    if (!res.ok) {
      throw new Error(`Upload failed (${res.status} ${res.statusText})`);
    }
    return;
  }

  const res = await fetch(target.url, {
    method: "PUT",
    body: blob,
    headers: { "Content-Type": blob.type },
  });
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status} ${res.statusText})`);
  }
};
