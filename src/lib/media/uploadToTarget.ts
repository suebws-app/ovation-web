type UploadTargetLike = {
  url: string;
  key: string;
  headers?: Record<string, string>;
  fields?: Record<string, string>;
};

export type UploadOptions = {
  onProgress?: (percent: number) => void;
  retries?: number;
};

export class UploadError extends Error {
  status: number | null;
  retryable: boolean;
  constructor(message: string, status: number | null, retryable: boolean) {
    super(message);
    this.name = "UploadError";
    this.status = status;
    this.retryable = retryable;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const buildBody = (
  target: UploadTargetLike,
  blob: Blob,
): {
  body: FormData | Blob;
  method: "POST" | "PUT";
  headers: Record<string, string>;
} => {
  if (target.fields) {
    const form = new FormData();
    for (const [k, v] of Object.entries(target.fields)) {
      form.append(k, v);
    }
    form.append("file", blob);
    return { body: form, method: "POST", headers: {} };
  }
  return {
    body: blob,
    method: "PUT",
    headers: target.headers ?? { "Content-Type": blob.type },
  };
};

const sendOnce = (
  target: UploadTargetLike,
  blob: Blob,
  onProgress?: (percent: number) => void,
): Promise<void> => {
  const { body, method, headers } = buildBody(target, blob);
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, target.url, true);
    for (const [k, v] of Object.entries(headers)) {
      xhr.setRequestHeader(k, v);
    }
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          onProgress(Math.min(99, pct));
        }
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        reject(
          new UploadError(
            `Upload failed (${xhr.status} ${xhr.statusText})`,
            xhr.status,
            xhr.status >= 500,
          ),
        );
      }
    };
    xhr.onerror = () => {
      reject(new UploadError("Network error during upload", null, true));
    };
    xhr.ontimeout = () => {
      reject(new UploadError("Upload timed out", null, true));
    };
    xhr.send(body);
  });
};

export const uploadToTarget = async (
  target: UploadTargetLike,
  blob: Blob,
  options: UploadOptions = {},
): Promise<void> => {
  const retries = options.retries ?? 3;
  const backoffs = [500, 1500, 4500];
  let lastError: unknown = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) options.onProgress?.(0);
      await sendOnce(target, blob, options.onProgress);
      return;
    } catch (error) {
      lastError = error;
      const retryable = error instanceof UploadError ? error.retryable : false;
      if (!retryable || attempt === retries - 1) break;
      await sleep(backoffs[attempt] ?? 4500);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Upload failed");
};
