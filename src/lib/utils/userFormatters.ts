type UserLike = {
  fullName?: string | null;
  email: string;
};

export const displayName = (user: UserLike): string =>
  user.fullName?.trim() || user.email.split("@")[0] || "Account";

export const initialsOf = (user: UserLike): string => {
  const source = user.fullName?.trim() || user.email;
  const parts = source.split(/[\s@]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  const initials = `${first}${second}`.toUpperCase();
  return initials || source[0]?.toUpperCase() || "?";
};
