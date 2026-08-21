import type { DemoFeedItem } from "./useDemoFeed";
import { DemoPhoneThumb } from "./DemoPhoneThumb";

type DemoPhoneAlbumProps = {
  items: DemoFeedItem[];
  eventTitle: string;
  countLabel: string;
  emptyLabel: string;
  photoAlt: string;
};

export const DemoPhoneAlbum = ({
  items,
  eventTitle,
  countLabel,
  emptyLabel,
  photoAlt,
}: DemoPhoneAlbumProps) => (
  <div className="bg-foreground rounded-20 small-desktop:rounded-24 ring-foreground/20 w-full p-1.5 shadow-lg ring-1">
    <div className="bg-card rounded-12 small-desktop:rounded-16 flex aspect-9/19 w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-center py-1.5">
        <span className="bg-foreground/25 h-1 w-8 rounded-full" />
      </div>
      <div className="small-desktop:gap-2.5 small-desktop:px-2.5 small-desktop:pb-2.5 flex min-h-0 flex-1 flex-col gap-1.5 px-1.5 pb-1.5">
        <div className="flex flex-col gap-1">
          <p className="type-caption text-foreground leading-tight font-semibold">
            {eventTitle}
          </p>
          <p className="type-caption text-muted-foreground leading-tight">
            {items.length > 0 ? countLabel : emptyLabel}
          </p>
        </div>
        <div className="small-desktop:gap-2 grid min-h-0 grid-cols-2 gap-1 overflow-hidden">
          {items.slice(0, 6).map((item) => (
            <DemoPhoneThumb
              key={item.id}
              url={item.url}
              alt={photoAlt}
              isNew={item.isNew}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);
