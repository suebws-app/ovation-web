export const groupBy = <T, K extends string | number>(
  items: readonly T[],
  keyFn: (item: T) => K,
): Array<{ key: K; items: T[] }> => {
  const groups: Array<{ key: K; items: T[] }> = [];
  for (const item of items) {
    const key = keyFn(item);
    const existing = groups.find((g) => g.key === key);
    if (existing) existing.items.push(item);
    else groups.push({ key, items: [item] });
  }
  return groups;
};
