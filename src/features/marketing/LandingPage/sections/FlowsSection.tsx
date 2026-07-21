import { useTranslations } from "next-intl";
import { SectionHeader } from "./SectionHeader";
import { FlowStep } from "./FlowStep";

const GUEST_STEPS = [
  {
    imageSrc: "/images/qr_code.webp",
    imageKey: "marketing__landing_b__guest_flow_step1_label",
    titleKey: "marketing__landing_b__guest_flow_step1_title",
    descriptionKey: "marketing__landing_b__guest_flow_step1_description",
  },
  {
    imageSrc: "/images/guest_page.webp",
    imageKey: "marketing__landing_b__guest_flow_step2_label",
    titleKey: "marketing__landing_b__guest_flow_step2_title",
    descriptionKey: "marketing__landing_b__guest_flow_step2_description",
  },
  {
    imageSrc: "/images/dashboard.webp",
    imageKey: "marketing__landing_b__guest_flow_step3_label",
    titleKey: "marketing__landing_b__guest_flow_step3_title",
    descriptionKey: "marketing__landing_b__guest_flow_step3_description",
  },
] as const;

const HOST_STEPS = [
  {
    imageSrc: "/images/create_event.webp",
    imageKey: "marketing__landing_b__host_flow_step1_label",
    titleKey: "marketing__landing_b__host_flow_step1_title",
    descriptionKey: "marketing__landing_b__host_flow_step1_description",
  },
  {
    imageSrc: "/images/qr_code.webp",
    imageKey: "marketing__landing_b__host_flow_step2_label",
    titleKey: "marketing__landing_b__host_flow_step2_title",
    descriptionKey: "marketing__landing_b__host_flow_step2_description",
  },
  {
    imageSrc: "/images/laptop_dashboard.webp",
    imageKey: "marketing__landing_b__host_flow_step3_label",
    titleKey: "marketing__landing_b__host_flow_step3_title",
    descriptionKey: "marketing__landing_b__host_flow_step3_description",
  },
  {
    imageSrc: "/images/gold_book.webp",
    imageKey: "marketing__landing_b__host_flow_step4_label",
    titleKey: "marketing__landing_b__host_flow_step4_title",
    descriptionKey: "marketing__landing_b__host_flow_step4_description",
  },
] as const;

export const FlowsSection = () => {
  const t = useTranslations();

  return (
    <section id="flows" className="bg-warm-panel/40">
      <div className="section-container">
        <SectionHeader
          eyebrow={t("marketing__landing_b__flows_eyebrow")}
          title={t("marketing__landing_b__flows_title")}
          description={t("marketing__landing_b__flows_description")}
        />

        <div className="flex flex-col gap-16">
          <div>
            <div className="border-border mb-7 flex items-baseline gap-4 border-b pb-5">
              <span className="landing-eyebrow text-primary">
                {t("marketing__landing_b__guest_flow_pill")}
              </span>
              <h3 className="landing-h3 text-foreground">
                {t("marketing__landing_b__guest_flow_title")}
              </h3>
              <span className="type-caption text-muted-foreground ml-auto">
                {t("marketing__landing_b__guest_flow_note")}
              </span>
            </div>
            <div className="tablet:grid-cols-3 grid grid-cols-1 gap-7">
              {GUEST_STEPS.map((step, i) => (
                <FlowStep
                  key={step.titleKey}
                  index={i + 1}
                  imageSrc={step.imageSrc}
                  imageAlt={t(step.imageKey)}
                  title={t(step.titleKey)}
                  description={t(step.descriptionKey)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="border-border mb-7 flex items-baseline gap-4 border-b pb-5">
              <span className="landing-eyebrow text-primary">
                {t("marketing__landing_b__host_flow_pill")}
              </span>
              <h3 className="landing-h3 text-foreground">
                {t("marketing__landing_b__host_flow_title")}
              </h3>
              <span className="type-caption text-muted-foreground ml-auto">
                {t("marketing__landing_b__host_flow_note")}
              </span>
            </div>
            <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid grid-cols-1 gap-7">
              {HOST_STEPS.map((step, i) => (
                <FlowStep
                  key={step.titleKey}
                  index={i + 1}
                  imageSrc={step.imageSrc}
                  imageAlt={t(step.imageKey)}
                  title={t(step.titleKey)}
                  description={t(step.descriptionKey)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
