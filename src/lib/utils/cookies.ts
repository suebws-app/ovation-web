type SameSite = "lax" | "strict" | "none";

type SetCookieOptions = {
  maxAge?: number;
  path?: string;
  sameSite?: SameSite;
  secure?: boolean;
};

export const setCookie = (
  name: string,
  value: string,
  options: SetCookieOptions = {},
): void => {
  if (typeof document === "undefined") return;
  const { maxAge, path = "/", sameSite = "lax", secure } = options;
  const parts: string[] = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${path}`,
  ];
  if (maxAge !== undefined) parts.push(`max-age=${maxAge}`);
  parts.push(`samesite=${sameSite}`);
  if (secure) parts.push("secure");
  document.cookie = parts.join(";");
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
};

export const deleteCookie = (name: string, path: string = "/"): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;path=${path};max-age=0;samesite=lax`;
};
