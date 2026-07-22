import { useTranslations } from "next-intl";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { PencilIcon } from "@ovation/icons/PencilIcon";
import { SectionHeader } from "./SectionHeader";
import { MemoryColumn } from "./MemoryColumn";

export const MemoryStrip = () => {
  const t = useTranslations();

  return (
    <section id="gallery" className="bg-warm-cream">
      <div className="section-container">
        <SectionHeader
          eyebrow={t("marketing__landing_b__collect_eyebrow")}
          title={t("marketing__landing_b__collect_title")}
        />

        <div className="border-border tablet:grid-cols-3 grid grid-cols-1 border-t">
          <MemoryColumn
            icon={<CameraIcon className="text-primary size-6" />}
            iconWrapClassName="bg-primary/15"
            title={t("marketing__landing_b__collect_photos_title")}
            description={t("marketing__landing_b__collect_photos_body")}
          />
          <MemoryColumn
            className="tablet:pl-10"
            icon={<MicIcon className="text-secondary size-6" />}
            iconWrapClassName="bg-secondary/20"
            title={t("marketing__landing_b__collect_voice_title")}
            description={t("marketing__landing_b__collect_voice_body")}
          />
          <MemoryColumn
            className="tablet:pl-10"
            icon={<PencilIcon className="text-accent size-6" />}
            iconWrapClassName="bg-accent/25"
            title={t("marketing__landing_b__collect_written_title")}
            description={t("marketing__landing_b__collect_written_body")}
          />
        </div>
      </div>
    </section>
  );
};
