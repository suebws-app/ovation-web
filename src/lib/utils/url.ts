export const extensionFromUrl = (url: string, fallback: string): string => {
  const path = url.split("?")[0];
  const match = /\.([a-z0-9]{2,5})$/i.exec(path);
  return match ? match[1].toLowerCase() : fallback;
};
