const NOISE_WORDS = ["Autoboekjes"];

export const formatVariantName = (name: string | null): string | null => {
  if (!name) return name;
  let cleaned = name;
  for (const word of NOISE_WORDS) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), "");
  }
  return cleaned
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([)\]])/g, "$1")
    .trim();
};
