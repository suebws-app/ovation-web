"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { Link } from "@/i18n/navigation";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { VoiceCaptureCard } from "./VoiceCaptureCard";
import { VideoCaptureCard } from "./VideoCaptureCard";
import { NoteCaptureCard } from "./NoteCaptureCard";

type ComposeClientProps = {
  slug: string;
};

export const ComposeClient = ({ slug }: ComposeClientProps) => {
  const t = useTranslations();
  const setSlug = useGuestSubmissionStore((s) => s.setSlug);

  useEffect(() => {
    setSlug(slug);
  }, [slug, setSlug]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-9 tablet:px-8 small-desktop:px-10 small-desktop:py-9">
        <WizardHeader
          backHref={`/g/${slug}`}
          step={1}
          totalSteps={3}
          title={t("guest__compose__title")}
          subtitle={t("guest__compose__subtitle")}
        />
        <div className="flex flex-col gap-3.5">
          <VoiceCaptureCard />
          <VideoCaptureCard />
          <NoteCaptureCard />
        </div>
      </div>
      <StickyCTA caption={t("guest__compose__caption")}>
        <Button asChild size="lg" className="w-full rounded-full shadow-lg">
          <Link href={`/g/${slug}/photo`}>
            {t("guest__wizard__continue")}
            <ArrowRight width={16} height={16} />
          </Link>
        </Button>
      </StickyCTA>
    </div>
  );
};
