import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import {
  EVENTS_TICK_MS,
  MOMENTS_TICK_MS,
  SOCIAL_PROOF_EVENTS,
  SOCIAL_PROOF_MOMENTS,
} from "./constants";
import { CountUpNumber } from "./CountUpNumber";
import { SocialProofHighlight } from "./SocialProofHighlight";

export const SocialProof = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);

  return (
    <section className="bg-background">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="mx-auto flex max-w-180 flex-col items-center text-center">
          <h2 className="landing-h1 tablet:landing-display text-foreground">
            {t.rich(`${GENERAL_KEY_PREFIX}proof_headline`, {
              momentsCount: SOCIAL_PROOF_MOMENTS,
              eventsCount: SOCIAL_PROOF_EVENTS,
              moments: () => (
                <SocialProofHighlight>
                  <CountUpNumber
                    value={SOCIAL_PROOF_MOMENTS}
                    tickMs={MOMENTS_TICK_MS}
                  />
                </SocialProofHighlight>
              ),
              events: () => (
                <SocialProofHighlight>
                  <CountUpNumber
                    value={SOCIAL_PROOF_EVENTS}
                    tickMs={EVENTS_TICK_MS}
                  />
                </SocialProofHighlight>
              ),
            })}
          </h2>

          <p className="landing-body-large text-muted-foreground mt-5">
            {k("proof_description")}
          </p>

          <div className="tablet:w-auto tablet:flex-row mt-10 flex w-full flex-col items-center gap-3">
            <Button
              variant="pillPrimary"
              size="pill"
              asChild
              className="tablet:w-auto w-full"
            >
              <Link href={appRoutes.auth.role}>{k("cta_primary")}</Link>
            </Button>
            <Button
              variant="pillGhost"
              size="pill"
              asChild
              className="tablet:w-auto w-full"
            >
              <Link href={appRoutes.marketing.pricing}>
                {k("proof_cta_pricing")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
