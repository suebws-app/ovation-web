export const daysBetween = (ms: number): number =>
  Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
