import { cn } from "@ovation/ui/utils/cn";

type AlbumItemProps = {
  label: string;
  count: number;
  active?: boolean;
};

export const AlbumItem = ({ label, count, active = false }: AlbumItemProps) => (
  <div
    className={cn(
      "rounded-10 type-body-small mb-0.5 flex cursor-pointer items-center gap-2.5 px-2.5 py-2.5 transition-colors",
      active
        ? "border-border bg-card text-foreground border font-semibold"
        : "text-muted-foreground hover:bg-muted",
    )}
  >
    <span className="flex-1">{label}</span>
    <span className="type-caption text-muted-foreground font-semibold">
      {count}
    </span>
  </div>
);
