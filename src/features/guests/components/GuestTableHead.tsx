const COLUMNS = [
  "",
  "Guest",
  "Group \u00b7 Table",
  "Contact",
  "Status",
  "Activity",
  "",
];

export const GuestTableHead = () => {
  return (
    <div className="border-border bg-background grid grid-cols-[28px_minmax(220px,1.4fr)_140px_150px_150px_120px_36px] items-center gap-3.5 border-b px-6 py-3">
      {COLUMNS.map((col, i) => (
        <div
          key={`${col}-${i}`}
          className="type-overline text-muted-foreground"
        >
          {col}
        </div>
      ))}
    </div>
  );
};
