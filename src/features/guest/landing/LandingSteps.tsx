import { getTranslations } from "next-intl/server";
import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { MailIcon } from "@ovation/icons/MailIcon";

import { LandingStepCard } from "./LandingStepCard";

type LandingStepsProps = {
  captureAudio: boolean;
  captureVideo: boolean;
  capturePhoto: boolean;
};

export const LandingSteps = async ({
  captureAudio,
  captureVideo,
  capturePhoto,
}: LandingStepsProps) => {
  const t = await getTranslations();

  const steps: Array<{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconClassName: string;
  }> = [];

  if (captureAudio) {
    steps.push({
      title: t("guest__landing__step_voice_title"),
      subtitle: t("guest__landing__step_voice_subtitle"),
      icon: <MicIcon width={18} height={18} />,
      iconClassName: "bg-primary",
    });
  }
  if (captureVideo) {
    steps.push({
      title: t("guest__landing__step_video_title"),
      subtitle: t("guest__landing__step_video_subtitle"),
      icon: <VideoIcon width={18} height={18} />,
      iconClassName: "bg-accent",
    });
  }
  if (capturePhoto) {
    steps.push({
      title: t("guest__landing__step_photo_title"),
      subtitle: t("guest__landing__step_photo_subtitle"),
      icon: <CameraIcon width={18} height={18} />,
      iconClassName: "bg-destructive",
    });
  }
  steps.push({
    title: t("guest__landing__step_send_title"),
    subtitle: t("guest__landing__step_send_subtitle"),
    icon: <MailIcon width={18} height={18} />,
    iconClassName: "bg-secondary",
  });

  return (
    <div>
      <p className="type-overline text-muted-foreground mb-2.5 px-0.5">
        {t("guest__landing__steps_eyebrow")}
      </p>
      <div className="flex flex-col gap-2.5">
        {steps.map((step, idx) => (
          <LandingStepCard
            key={step.title}
            index={idx + 1}
            title={step.title}
            subtitle={step.subtitle}
            icon={step.icon}
            iconClassName={step.iconClassName}
          />
        ))}
      </div>
    </div>
  );
};
