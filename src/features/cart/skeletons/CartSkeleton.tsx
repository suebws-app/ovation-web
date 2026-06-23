import { Card, CardContent } from "@ovation/ui/components/Card";
import { containerClassName } from "@/lib/utils/layoutClassNames";

const ITEM_COUNT = 3;
const items = Array.from({ length: ITEM_COUNT }, (_, i) => i);
const summaryRows = Array.from({ length: 4 }, (_, i) => i);

export const CartSkeleton = () => (
  <div className={containerClassName}>
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-muted h-6 w-32 animate-pulse rounded" />
          <div className="bg-muted h-4 w-48 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
      </CardContent>
    </Card>
    <div className="desktop:grid-cols-[1fr_360px] grid grid-cols-1 gap-6">
      <Card>
        {items.map((i) => (
          <div
            key={i}
            className="border-border flex items-center gap-4 border-b p-4 last:border-b-0"
          >
            <div className="bg-muted rounded-8 size-16 shrink-0 animate-pulse" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="bg-muted h-4 w-40 animate-pulse rounded" />
              <div className="bg-muted h-3 w-24 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-5 w-16 shrink-0 animate-pulse rounded" />
          </div>
        ))}
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="bg-muted h-5 w-28 animate-pulse rounded" />
          {summaryRows.map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="bg-muted h-3.5 w-20 animate-pulse rounded" />
              <div className="bg-muted h-3.5 w-16 animate-pulse rounded" />
            </div>
          ))}
          <div className="bg-muted rounded-8 mt-2 h-11 w-full animate-pulse" />
        </CardContent>
      </Card>
    </div>
  </div>
);
