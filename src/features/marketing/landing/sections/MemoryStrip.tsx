import { useTranslations } from "next-intl";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { PencilIcon } from "@ovation/icons/PencilIcon";
import { SectionHeader } from "./SectionHeader";
import { MemoryColumn } from "./MemoryColumn";
import { WEDDING_KEY_PREFIX } from "../variant";

type MemoryStripProps = {
  keyPrefix?: string;
};

export const MemoryStrip = ({
  keyPrefix = WEDDING_KEY_PREFIX,
}: MemoryStripProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${keyPrefix}${suffix}`);

  return (
    <section id="gallery" className="bg-warm-cream">
      <div className="section-container">
        <SectionHeader
          eyebrow={k("collect_eyebrow")}
          title={k("collect_title")}
        />

        <div className="border-border tablet:grid-cols-3 grid grid-cols-1 border-t">
          <MemoryColumn
            icon={<CameraIcon className="text-primary size-6" />}
            iconWrapClassName="bg-primary/15"
            title={k("collect_photos_title")}
            description={k("collect_photos_body")}
          />
          <MemoryColumn
            className="tablet:pl-10"
            icon={<MicIcon className="text-secondary size-6" />}
            iconWrapClassName="bg-secondary/20"
            title={k("collect_voice_title")}
            description={k("collect_voice_body")}
          />
          <MemoryColumn
            className="tablet:pl-10"
            icon={<PencilIcon className="text-accent size-6" />}
            iconWrapClassName="bg-accent/25"
            title={k("collect_written_title")}
            description={k("collect_written_body")}
          />
        </div>
      </div>
    </section>
  );
};
