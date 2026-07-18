const WORDS_PER_MINUTE = 220;

export const estimateReadingMinutes = (markdown: string): number => {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
