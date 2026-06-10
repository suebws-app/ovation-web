const FIELD_COUNT = 5;
const fields = Array.from({ length: FIELD_COUNT }, (_, i) => i);

export const SettingsFormSkeleton = () => (
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-3">
      <div className="bg-muted h-7 w-48 animate-pulse rounded" />
      <div className="bg-muted h-4 w-72 max-w-full animate-pulse rounded" />
    </div>
    <div className="bg-card border-border rounded-16 flex flex-col gap-5 border p-6">
      {fields.map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="bg-muted h-3.5 w-28 animate-pulse rounded" />
          <div className="bg-muted rounded-8 h-10 w-full animate-pulse" />
        </div>
      ))}
      <div className="bg-muted rounded-8 h-10 w-32 animate-pulse self-start" />
    </div>
  </div>
);
