import { Card, CardContent } from "@ovation/ui/components/Card";
import { containerClassName } from "@/lib/utils/layoutClassNames";

const STAT_COUNT = 4;
const stats = Array.from({ length: STAT_COUNT }, (_, i) => i);

export const QRCodeSkeleton = () => (
  <div className={containerClassName}>
    <div className="flex flex-col gap-2">
      <div className="bg-muted h-7 w-40 animate-pulse rounded" />
      <div className="bg-muted h-4 w-64 max-w-full animate-pulse rounded" />
    </div>
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="bg-muted h-4 w-48 animate-pulse rounded" />
        <div className="bg-muted h-3 w-72 max-w-full animate-pulse rounded" />
      </CardContent>
    </Card>
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-muted rounded-12 size-64 max-w-full animate-pulse" />
        <div className="bg-muted rounded-8 h-9 w-40 animate-pulse" />
      </CardContent>
    </Card>
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="bg-muted h-5 w-28 animate-pulse rounded" />
        <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
          {stats.map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="bg-muted h-3 w-16 animate-pulse rounded" />
              <div className="bg-muted h-5 w-10 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
