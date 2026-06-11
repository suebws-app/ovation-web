type Translator = {
  (...args: never[]): string;
  has(key: string): boolean;
};

const humanize = (key: string): string => {
  const tail = key.split("__").pop() ?? key;
  const cleaned = tail.replace(/[_-]+/g, " ").trim();
  if (!cleaned) return key;
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
};

export const translateKey = (t: Translator, key: string): string => {
  if (!key) return "";
  if (t.has(key)) {
    return (t as unknown as (k: string) => string)(key);
  }
  return humanize(key);
};
