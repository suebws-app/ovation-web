import { isLocale } from "./isLocale";

export const stripLocale = (pathname: string): string => {
  const parts = pathname.split("/").filter(Boolean);
  const filtered = parts[0] && isLocale(parts[0]) ? parts.slice(1) : parts;
  return `/${filtered.join("/")}`;
};
