import { useTranslations } from "next-intl";
import { PlayIcon } from "@ovation/icons/PlayIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { HERO_OCCASION_SUFFIXES } from "./constants";
import { TypewriterWord } from "./TypewriterWord";
import { HeroDeviceComposite } from "./HeroDeviceComposite";

export const GeneralHero = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);
  const occasions = HERO_OCCASION_SUFFIXES.map((suffix) => k(suffix));

  return (
    <section className="bg-background">
      <div className="desktop:grid-cols-[1.05fr_1fr] desktop:gap-10 tablet:py-14 desktop:py-16 mx-auto grid w-full max-w-332 grid-cols-1 items-center gap-10 px-6 py-10">
        <div className="desktop:items-start desktop:text-left flex flex-col items-center text-center">
          <h1 className="landing-h1 tablet:landing-display small-desktop:landing-hero text-foreground">
            {k("hero_title_lead_1")} {k("hero_title_lead_2")}
            <span className="block">
              <TypewriterWord words={occasions} />
            </span>
          </h1>

          <p className="landing-body-large text-muted-foreground mt-6 max-w-125">
            {k("hero_description")}
          </p>

          <div className="tablet:mt-8 tablet:w-auto tablet:flex-row tablet:items-center mt-7 flex w-full flex-col gap-3">
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
              <Link href={appRoutes.marketing.howItWorks}>
                <PlayIcon className="size-4" aria-hidden />
                {k("cta_secondary")}
              </Link>
            </Button>
          </div>

          <p className="text-muted-foreground type-body-small mt-5">
            {k("hero_micro_note")}
          </p>
        </div>

        <HeroDeviceComposite keyPrefix={GENERAL_KEY_PREFIX} />
      </div>
    </section>
  );
};
