const SECTION_COUNT = 3;
const sections = Array.from({ length: SECTION_COUNT }, (_, i) => i);

export const LinkSettingsSkeleton = () => (
  <div className="mx-auto w-full min-w-0 p-6">
    <div className="flex flex-col gap-6">
      <div className="bg-card border-border rounded-12 flex flex-col gap-3 border p-6">
        <div className="bg-muted h-6 w-48 rounded animate-pulse" />
        <div className="bg-muted h-4 w-72 max-w-full rounded animate-pulse" />
        <div className="bg-muted h-10 w-full rounded-8 animate-pulse" />
      </div>
      {sections.map((i) => (
        <div
          key={i}
          className="bg-card border-border rounded-12 flex flex-col gap-3 border p-6"
        >
          <div className="bg-muted h-5 w-36 rounded animate-pulse" />
          <div className="bg-muted h-3.5 w-64 max-w-full rounded animate-pulse" />
          <div className="bg-muted h-10 w-full rounded-8 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);
