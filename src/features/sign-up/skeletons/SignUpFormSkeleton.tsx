const FIELD_COUNT = 3;
const fields = Array.from({ length: FIELD_COUNT }, (_, i) => i);

export const SignUpFormSkeleton = () => (
  <div className="flex w-full max-w-md flex-col gap-6">
    <div className="flex flex-col gap-2">
      <div className="bg-muted h-7 w-48 animate-pulse rounded" />
      <div className="bg-muted h-4 w-64 max-w-full animate-pulse rounded" />
    </div>
    {fields.map((i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <div className="bg-muted h-3.5 w-24 animate-pulse rounded" />
        <div className="bg-muted rounded-8 h-11 w-full animate-pulse" />
      </div>
    ))}
    <div className="bg-muted rounded-8 h-11 w-full animate-pulse" />
  </div>
);
