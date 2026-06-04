const ROW_COUNT = 4;
const rows = Array.from({ length: ROW_COUNT }, (_, i) => i);

export const SettingsBillingSkeleton = () => (
  <div className="flex flex-col gap-8">
    <div className="bg-card border-border rounded-16 flex flex-col gap-4 border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="bg-muted h-3 w-20 rounded animate-pulse" />
          <div className="bg-muted h-6 w-40 rounded animate-pulse" />
          <div className="bg-muted h-4 w-56 max-w-full rounded animate-pulse" />
        </div>
        <div className="bg-muted h-9 w-28 rounded-8 animate-pulse" />
      </div>
      <div className="bg-border h-px w-full" />
      <div className="flex items-center justify-between">
        <div className="bg-muted h-4 w-32 rounded animate-pulse" />
        <div className="bg-muted h-4 w-24 rounded animate-pulse" />
      </div>
    </div>
    <div className="bg-card border-border rounded-16 flex flex-col gap-3 border p-6">
      <div className="bg-muted h-5 w-44 rounded animate-pulse" />
      <div className="bg-muted h-4 w-72 max-w-full rounded animate-pulse" />
    </div>
    <div className="bg-card border-border rounded-16 overflow-hidden border">
      <div className="border-border border-b px-6 py-4">
        <div className="bg-muted h-5 w-40 rounded animate-pulse" />
      </div>
      {rows.map((i) => (
        <div
          key={i}
          className="border-border flex items-center justify-between border-b px-6 py-4 last:border-b-0"
        >
          <div className="flex flex-col gap-1.5">
            <div className="bg-muted h-3.5 w-32 rounded animate-pulse" />
            <div className="bg-muted h-3 w-20 rounded animate-pulse" />
          </div>
          <div className="bg-muted h-3.5 w-14 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);
