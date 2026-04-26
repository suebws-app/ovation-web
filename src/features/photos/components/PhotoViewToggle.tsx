import { Grid } from "@ovation/icons/Grid";
import { Menu } from "@ovation/icons/Menu";

export const PhotoViewToggle = () => (
  <div className="rounded-10 border-border bg-card desktop:inline-flex hidden cursor-pointer items-center gap-1 border px-2.5 py-2">
    <span className="rounded-4 bg-primary/10 p-1">
      <Grid width={12} height={12} className="text-primary" strokeWidth={1.7} />
    </span>
    <Menu
      width={12}
      height={12}
      className="text-muted-foreground"
      strokeWidth={1.7}
    />
  </div>
);
