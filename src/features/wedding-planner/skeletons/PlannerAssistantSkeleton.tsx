import { Skeleton } from "@ovation/ui/components/Skeleton";
import { Card } from "@ovation/ui/components/Card";
import { PlannerViewHeaderSkeleton } from "./PlannerViewHeaderSkeleton";

const TURNS = [
  { fromUser: false, width: "w-4/5" },
  { fromUser: true, width: "w-2/3" },
  { fromUser: false, width: "w-full" },
  { fromUser: true, width: "w-1/2" },
];

export const PlannerAssistantSkeleton = () => (
  <>
    <PlannerViewHeaderSkeleton actionWidth="w-24" />
    <Card className="flex flex-col overflow-hidden p-0">
      <div className="flex flex-col gap-4 p-6">
        {TURNS.map((turn, i) => (
          <div
            key={i}
            className={`flex ${turn.fromUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] flex-col gap-2 rounded-2xl p-4 ${turn.fromUser ? "bg-primary/10" : "bg-muted"}`}
            >
              <Skeleton className={`h-3 ${turn.width}`} />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-border flex items-center gap-3 border-t p-4">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="size-11 shrink-0 rounded-full" />
      </div>
    </Card>
  </>
);
