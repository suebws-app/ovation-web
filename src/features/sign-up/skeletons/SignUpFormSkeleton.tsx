const FIELD_COUNT = 3;
const fields = Array.from({ length: FIELD_COUNT }, (_, i) => i);

export const SignUpFormSkeleton = () => (
  <div className="flex w-full max-w-md flex-col gap-6">
    <div className="flex flex-col gap-2">
      <div className="bg-muted h-7 w-48 rounded animate-pulse" />
      <div className="bg-muted h-4 w-64 max-w-full rounded animate-pulse" />
    </div>
    {fields.map((i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <div className="bg-muted h-3.5 w-24 rounded animate-pulse" />
        <div className="bg-muted h-11 w-full rounded-8 animate-pulse" />
      </div>
    ))}
    <div className="bg-muted h-11 w-full rounded-8 animate-pulse" />
  </div>
);
