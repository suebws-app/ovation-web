const TINTS = [
  "#EFC9A8",
  "#D8C9B2",
  "#B9C9D9",
  "#C8B5D9",
  "#B8D3B6",
  "#E9BFC4",
  "#F2D7B3",
  "#ADC4D1",
];

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export const tintFor = (key: string): string =>
  TINTS[hashString(key) % TINTS.length];

export const initialsFor = (firstName: string, lastName?: string | null) => {
  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName?.trim() ?? "";
  if (trimmedFirst && trimmedLast) {
    return (trimmedFirst[0] + trimmedLast[0]).toUpperCase();
  }
  if (trimmedFirst) return trimmedFirst.slice(0, 2).toUpperCase();
  return "?";
};
