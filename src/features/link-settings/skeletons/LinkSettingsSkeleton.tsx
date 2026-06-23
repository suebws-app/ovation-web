import { Card, CardContent } from "@ovation/ui/components/Card";
import { containerClassName } from "@/lib/utils/layoutClassNames";

const SECTION_COUNT = 3;
const sections = Array.from({ length: SECTION_COUNT }, (_, i) => i);

export const LinkSettingsSkeleton = () => (
  <div className={containerClassName}>
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="bg-muted h-6 w-48 animate-pulse rounded" />
        <div className="bg-muted h-4 w-72 max-w-full animate-pulse rounded" />
        <div className="bg-muted rounded-8 h-10 w-full animate-pulse" />
      </CardContent>
    </Card>
    {sections.map((i) => (
      <Card key={i}>
        <CardContent className="flex flex-col gap-3">
          <div className="bg-muted h-5 w-36 animate-pulse rounded" />
          <div className="bg-muted h-3.5 w-64 max-w-full animate-pulse rounded" />
          <div className="bg-muted rounded-8 h-10 w-full animate-pulse" />
        </CardContent>
      </Card>
    ))}
  </div>
);
