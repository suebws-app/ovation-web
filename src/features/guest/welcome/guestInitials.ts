export const guestInitials = (title: string): string =>
  title
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
