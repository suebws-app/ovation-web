import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { COMPARISON_OTHERS_KEYS, COMPARISON_OVATION_KEYS } from "./constants";
import { ComparisonColumn } from "./ComparisonColumn";
import { PhotoSplitBand } from "./PhotoSplitBand";

export const Comparison = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);

  return (
    <section className="bg-warm-cream">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="mx-auto flex max-w-160 flex-col items-center text-center">
          <h2 className="landing-h1 tablet:landing-display text-foreground">
            {k("compare_title_line1")}{" "}
            <span className="text-primary italic">
              {k("compare_title_line2")}
            </span>
          </h2>
          <p className="landing-body-large text-muted-foreground mt-5">
            {k("compare_description")}
          </p>
        </div>

        <div className="tablet:mt-16 mt-10">
          <PhotoSplitBand
            photoAlt={k("hero_showcase_alt")}
            moreLabel={k("compare_pill_more")}
            fewerLabel={k("compare_pill_fewer")}
          />
        </div>

        <div className="tablet:grid-cols-2 tablet:mt-20 tablet:gap-16 mx-auto mt-14 grid max-w-240 grid-cols-1 gap-12">
          <ComparisonColumn
            heading={
              <>
                <span className="sr-only">Ovation</span>
                <Logo aria-hidden />
              </>
            }
            items={COMPARISON_OVATION_KEYS.map((key) => k(key))}
            isPositive
          />
          <ComparisonColumn
            heading={
              <span className="text-foreground landing-h4">
                {k("compare_others_heading")}
              </span>
            }
            items={COMPARISON_OTHERS_KEYS.map((key) => k(key))}
            isPositive={false}
          />
        </div>

        <div className="tablet:w-auto tablet:flex-row mx-auto mt-14 flex w-full flex-col items-center justify-center gap-3">
          <Button
            variant="pillPrimary"
            size="pill"
            asChild
            className="tablet:w-auto w-full"
          >
            <Link href={appRoutes.auth.role}>{k("compare_cta_primary")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
