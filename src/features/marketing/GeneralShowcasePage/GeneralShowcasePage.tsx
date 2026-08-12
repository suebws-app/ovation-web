import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { GENERAL_KEY_PREFIX } from "../landing/variant";
import { EventsHero } from "./sections/EventsHero";
import { EventStrip } from "./sections/EventStrip";
import { ScanAnimation } from "./sections/ScanAnimation";
import { AddMemoriesAnimation } from "./sections/AddMemoriesAnimation";
import { SavedInstantlyAnimation } from "./sections/SavedInstantlyAnimation";
import { CreateEventAnimation } from "./sections/CreateEventAnimation";
import { ShareAccessAnimation } from "./sections/ShareAccessAnimation";
import { WatchItCollectAnimation } from "./sections/WatchItCollectAnimation";
import { KeepItForeverAnimation } from "./sections/KeepItForeverAnimation";

const OccasionsSection = dynamic(() =>
  import("./sections/OccasionsSection").then((m) => ({
    default: m.OccasionsSection,
  })),
);
const FlowsSection = dynamic(() =>
  import("../landing/sections/FlowsSection").then((m) => ({
    default: m.FlowsSection,
  })),
);
const MemoryStrip = dynamic(() =>
  import("../landing/sections/MemoryStrip").then((m) => ({
    default: m.MemoryStrip,
  })),
);
const PlannerSection = dynamic(() =>
  import("./sections/PlannerSection").then((m) => ({
    default: m.PlannerSection,
  })),
);
const AlbumsSection = dynamic(() =>
  import("./sections/AlbumsSection").then((m) => ({
    default: m.AlbumsSection,
  })),
);
const FinalDarkCTA = dynamic(() =>
  import("../landing/sections/FinalDarkCTA").then((m) => ({
    default: m.FinalDarkCTA,
  })),
);

export const GeneralShowcasePage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-warm-cream">
      <EventsHero />
      <EventStrip />
      <OccasionsSection />
      <FlowsSection
        keyPrefix={GENERAL_KEY_PREFIX}
        guestStep1Visual={<ScanAnimation showCaption={false} />}
        guestStep2Visual={<AddMemoriesAnimation showCaption={false} />}
        guestStep3Visual={<SavedInstantlyAnimation showCaption={false} />}
        hostStep1Visual={<CreateEventAnimation showCaption={false} />}
        hostStep2Visual={<ShareAccessAnimation showCaption={false} />}
        hostStep3Visual={<WatchItCollectAnimation showCaption={false} />}
        hostStep4Visual={<KeepItForeverAnimation showCaption={false} />}
        hostGridClassName="tablet:grid-cols-2 desktop:grid-cols-4"
      />
      <MemoryStrip keyPrefix={GENERAL_KEY_PREFIX} />
      <PlannerSection />
      <AlbumsSection />
      <FinalDarkCTA keyPrefix={GENERAL_KEY_PREFIX} />
    </div>
  );
};
