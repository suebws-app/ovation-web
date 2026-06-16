export const buildLogoSrc = (
  background: string,
  foreground: string,
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="${background}"/><text x="24" y="33" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="${foreground}">O</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
