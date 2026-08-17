import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { ENJOY_PILLS } from "./constants";
import { StepRow } from "./StepRow";
import { StepVisualCreate } from "./StepVisualCreate";
import { StepVisualShare } from "./StepVisualShare";
import { StepVisualSlideshow } from "./StepVisualSlideshow";
import { StepVisualEnjoy } from "./StepVisualEnjoy";

export const HowItWorksSteps = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);
  const stepLabel = (number: number) =>
    t(`${GENERAL_KEY_PREFIX}hero_step_label`, { number });

  const createEventAction = (
    <Button variant="pillPrimary" size="pill" asChild>
      <Link href={appRoutes.auth.role}>{k("cta_primary")}</Link>
    </Button>
  );

  return (
    <section className="bg-warm-cream">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="mx-auto flex max-w-160 flex-col items-center text-center">
          <h2 className="landing-h1 tablet:landing-display text-foreground">
            {k("hiw_title")}
          </h2>
          <p className="landing-body-large text-muted-foreground mt-5">
            {k("hiw_description")}
          </p>
        </div>

        <div className="tablet:mt-24 tablet:gap-28 mt-14 flex flex-col gap-20">
          <StepRow
            number={1}
            stepLabel={stepLabel(1)}
            title={k("hiw_1_title")}
            description={k("hiw_1_description")}
            action={createEventAction}
            visual={
              <StepVisualCreate
                browserAlt={k("hiw_1_browser_alt")}
                phoneAlt={k("hiw_1_phone_alt")}
              />
            }
          />

          <StepRow
            number={2}
            stepLabel={stepLabel(2)}
            title={k("hiw_2_title")}
            description={k("hiw_2_description")}
            bullets={[
              k("hiw_2_bullet_1"),
              k("hiw_2_bullet_2"),
              k("hiw_2_bullet_3"),
            ]}
            visualFirst
            visual={
              <StepVisualShare
                signAlt={k("hiw_2_sign_alt")}
                phoneAlt={k("hiw_2_phone_alt")}
              />
            }
          />

          <StepRow
            number={3}
            stepLabel={t(`${GENERAL_KEY_PREFIX}hiw_step_label_optional`, {
              number: 3,
            })}
            title={k("hiw_3_title")}
            description={k("hiw_3_description")}
            action={
              <Button variant="pillGhost" size="pill" asChild>
                <Link href={appRoutes.marketing.sample}>
                  {k("hiw_3_cta")}
                  <ArrowRightIcon className="size-4" aria-hidden />
                </Link>
              </Button>
            }
            visual={
              <StepVisualSlideshow
                photoAlt={k("hiw_3_photo_alt")}
                captionLabel={k("hiw_3_caption")}
                qrLabel={k("hero_showcase_qr_label")}
              />
            }
          />

          <StepRow
            number={4}
            stepLabel={stepLabel(4)}
            title={k("hiw_4_title")}
            description={k("hiw_4_description")}
            bullets={[k("hiw_4_bullet_1"), k("hiw_4_bullet_2")]}
            action={createEventAction}
            visualFirst
            visual={
              <StepVisualEnjoy
                photoAlt={k("hiw_4_photo_alt")}
                pillLabels={ENJOY_PILLS.map((pill) =>
                  k(`hiw_pill_${pill.key}`),
                )}
              />
            }
          />
        </div>
      </div>
    </section>
  );
};
