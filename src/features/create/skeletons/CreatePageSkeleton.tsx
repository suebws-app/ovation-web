const FIELD_COUNT = 4;
const fields = Array.from({ length: FIELD_COUNT }, (_, i) => i);

export const CreatePageSkeleton = () => (
  <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
    <div className="flex flex-col gap-2">
      <div className="bg-muted h-3 w-20 rounded animate-pulse" />
      <div className="bg-muted h-8 w-72 max-w-full rounded animate-pulse" />
      <div className="bg-muted h-4 w-96 max-w-full rounded animate-pulse" />
    </div>
    <div className="bg-card border-border rounded-16 flex flex-col gap-5 border p-6">
      {fields.map((i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="bg-muted h-3.5 w-28 rounded animate-pulse" />
          <div className="bg-muted h-11 w-full rounded-8 animate-pulse" />
        </div>
      ))}
      <div className="bg-muted h-11 w-full rounded-8 animate-pulse" />
    </div>
  </div>
);
