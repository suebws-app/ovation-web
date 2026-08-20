"use client";

import { useTranslations } from "next-intl";
import { DEMO_SEED_PHOTOS } from "./constants";
import type { DemoFeedItem } from "./useDemoFeed";
import { DemoTabletWall } from "./DemoTabletWall";
import { DemoPhoneAlbum } from "./DemoPhoneAlbum";

type DemoStageProps = {
  items: DemoFeedItem[];
  guestUrl: string | null;
};

const seedItems: DemoFeedItem[] = DEMO_SEED_PHOTOS.map((url) => ({
  id: url,
  url,
  isNew: false,
}));

export const DemoStage = ({ items, guestUrl }: DemoStageProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`marketing__${suffix}`);
  const wallItems = [...items, ...seedItems];

  return (
    <div className="small-desktop:pr-14 small-desktop:pb-8 relative w-full pr-10 pb-12">
      <p className="type-caption text-muted-foreground mb-2 text-center">
        {k("demo_wall_label")}
      </p>
      <DemoTabletWall
        key={wallItems[0]?.id}
        items={wallItems}
        guestUrl={guestUrl}
      />

      <div className="small-desktop:w-1/5 small-desktop:top-1/3 absolute top-1/4 right-0 z-10 flex w-1/4 flex-col items-center gap-1.5">
        <DemoPhoneAlbum
          items={items}
          eventTitle={k("demo_album_title")}
          countLabel={k("demo_album_count")}
          emptyLabel={k("demo_album_empty")}
          photoAlt={k("demo_wall_alt")}
        />
        <p className="type-caption text-muted-foreground">
          {k("demo_album_label")}
        </p>
      </div>
    </div>
  );
};
