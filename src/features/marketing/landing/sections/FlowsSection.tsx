import { useTranslations } from "next-intl";
import { SectionHeader } from "./SectionHeader";
import { FlowStep } from "./FlowStep";
import { WEDDING_KEY_PREFIX } from "../variant";

const GUEST_STEPS = [
  {
    imageSrc: "/images/qr_code.webp",
    imageSuffix: "guest_flow_step1_label",
    titleSuffix: "guest_flow_step1_title",
    descriptionSuffix: "guest_flow_step1_description",
  },
  {
    imageSrc: "/images/guest_page.webp",
    imageSuffix: "guest_flow_step2_label",
    titleSuffix: "guest_flow_step2_title",
    descriptionSuffix: "guest_flow_step2_description",
  },
  {
    imageSrc: "/images/dashboard.webp",
    imageSuffix: "guest_flow_step3_label",
    titleSuffix: "guest_flow_step3_title",
    descriptionSuffix: "guest_flow_step3_description",
  },
] as const;

const HOST_STEPS = [
  {
    imageSrc: "/images/create_event.webp",
    imageSuffix: "host_flow_step1_label",
    titleSuffix: "host_flow_step1_title",
    descriptionSuffix: "host_flow_step1_description",
  },
  {
    imageSrc: "/images/qr_code.webp",
    imageSuffix: "host_flow_step2_label",
    titleSuffix: "host_flow_step2_title",
    descriptionSuffix: "host_flow_step2_description",
  },
  {
    imageSrc: "/images/laptop_dashboard.webp",
    imageSuffix: "host_flow_step3_label",
    titleSuffix: "host_flow_step3_title",
    descriptionSuffix: "host_flow_step3_description",
  },
  {
    imageSrc: "/images/gold_book.webp",
    imageSuffix: "host_flow_step4_label",
    titleSuffix: "host_flow_step4_title",
    descriptionSuffix: "host_flow_step4_description",
  },
] as const;

type FlowsSectionProps = {
  keyPrefix?: string;
  guestStep1Visual?: React.ReactNode;
  guestStep2Visual?: React.ReactNode;
  guestStep3Visual?: React.ReactNode;
  hostStep1Visual?: React.ReactNode;
  hostStep2Visual?: React.ReactNode;
  hostStep3Visual?: React.ReactNode;
  hostStep4Visual?: React.ReactNode;
  guestGridClassName?: string;
  hostGridClassName?: string;
};

export const FlowsSection = ({
  keyPrefix = WEDDING_KEY_PREFIX,
  guestStep1Visual,
  guestStep2Visual,
  guestStep3Visual,
  hostStep1Visual,
  hostStep2Visual,
  hostStep3Visual,
  hostStep4Visual,
  guestGridClassName = "tablet:grid-cols-3",
  hostGridClassName = "tablet:grid-cols-2 desktop:grid-cols-4",
}: FlowsSectionProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${keyPrefix}${suffix}`);

  return (
    <section id="flows" className="bg-warm-panel/40">
      <div className="section-container">
        <SectionHeader
          eyebrow={k("flows_eyebrow")}
          title={k("flows_title")}
          description={k("flows_description")}
        />

        <div className="flex flex-col gap-16">
          <div>
            <div className="border-border mb-7 flex items-baseline gap-4 border-b pb-5">
              <span className="landing-eyebrow text-primary">
                {k("guest_flow_pill")}
              </span>
              <h3 className="landing-h3 text-foreground">
                {k("guest_flow_title")}
              </h3>
              <span className="type-caption text-muted-foreground ml-auto">
                {k("guest_flow_note")}
              </span>
            </div>
            <div className={`grid grid-cols-1 gap-7 ${guestGridClassName}`}>
              {GUEST_STEPS.map((step, i) => (
                <FlowStep
                  key={step.titleSuffix}
                  index={i + 1}
                  imageSrc={step.imageSrc}
                  imageAlt={k(step.imageSuffix)}
                  title={k(step.titleSuffix)}
                  description={k(step.descriptionSuffix)}
                  visual={
                    i === 0
                      ? guestStep1Visual
                      : i === 1
                        ? guestStep2Visual
                        : i === 2
                          ? guestStep3Visual
                          : undefined
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <div className="border-border mb-7 flex items-baseline gap-4 border-b pb-5">
              <span className="landing-eyebrow text-primary">
                {k("host_flow_pill")}
              </span>
              <h3 className="landing-h3 text-foreground">
                {k("host_flow_title")}
              </h3>
              <span className="type-caption text-muted-foreground ml-auto">
                {k("host_flow_note")}
              </span>
            </div>
            <div className={`grid grid-cols-1 gap-7 ${hostGridClassName}`}>
              {HOST_STEPS.map((step, i) => (
                <FlowStep
                  key={step.titleSuffix}
                  index={i + 1}
                  imageSrc={step.imageSrc}
                  imageAlt={k(step.imageSuffix)}
                  title={k(step.titleSuffix)}
                  description={k(step.descriptionSuffix)}
                  visual={
                    i === 0
                      ? hostStep1Visual
                      : i === 1
                        ? hostStep2Visual
                        : i === 2
                          ? hostStep3Visual
                          : i === 3
                            ? hostStep4Visual
                            : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
