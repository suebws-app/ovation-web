import { capitalize } from "./capitalize";

export const formatNativeLanguageName = (code: string): string => {
  try {
    const displayNames = new Intl.DisplayNames([code], { type: "language" });
    return capitalize(displayNames.of(code) ?? code.toUpperCase());
  } catch {
    return code.toUpperCase();
  }
};
