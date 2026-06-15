export const saveBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  saveUrl(url, filename);
  URL.revokeObjectURL(url);
};

export const saveDataUrl = (dataUrl: string, filename: string): void =>
  saveUrl(dataUrl, filename);

const saveUrl = (href: string, filename: string): void => {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
