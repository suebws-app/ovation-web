export const formatMonthLabel = (month: string, locale: string): string => {
  const date = new Date(`${month}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return month;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
  }).format(date);
};
