import { formatShortDate } from "@/features/wedding-planner/utils";

type WeddingPlannerWidgetTaskRowProps = {
  title: string;
  dueDate: string | null;
};

export const WeddingPlannerWidgetTaskRow = ({
  title,
  dueDate,
}: WeddingPlannerWidgetTaskRowProps) => (
  <div className="flex items-center justify-between gap-2">
    <span className="type-body-small min-w-0 flex-1 truncate font-medium">
      {title}
    </span>
    {dueDate ? (
      <span className="type-caption text-muted-foreground shrink-0">
        {formatShortDate(dueDate)}
      </span>
    ) : null}
  </div>
);
