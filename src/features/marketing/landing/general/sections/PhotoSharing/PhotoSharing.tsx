import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { SHARING_FEATURES_LEFT, SHARING_FEATURES_RIGHT } from "./constants";
import { FeatureColumn } from "./FeatureColumn";
import { ShowcasePhone } from "./ShowcasePhone";
import { DemoTrigger } from "@/features/marketing/demo";

export const PhotoSharing = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);
  const withCopy = (items: typeof SHARING_FEATURES_LEFT) =>
    items.map((item) => ({
      ...item,
      title: k(`sharing_${item.key}_title`),
      description: k(`sharing_${item.key}_description`),
    }));

  return (
    <section id="product" className="bg-background scroll-mt-20">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="mx-auto flex max-w-160 flex-col items-center text-center">
          <h2 className="landing-h1 tablet:landing-display text-foreground">
            {k("sharing_title")}
          </h2>
          <p className="landing-body-large text-muted-foreground mt-5">
            {k("sharing_description")}
          </p>
          <div className="tablet:w-auto tablet:flex-row mt-8 flex w-full flex-col items-center gap-3">
            <Button
              variant="pillPrimary"
              size="pill"
              asChild
              className="tablet:w-auto w-full"
            >
              <Link href={appRoutes.auth.role}>{k("sharing_cta_primary")}</Link>
            </Button>
            <DemoTrigger className="tablet:w-auto w-full">
              {k("sharing_cta_secondary")}
              <ArrowRightIcon className="size-4" aria-hidden />
            </DemoTrigger>
          </div>
        </div>

        <div className="tablet:grid-cols-[1fr_auto_1fr] tablet:gap-10 desktop:gap-16 mt-16 grid grid-cols-1 items-center gap-12">
          <FeatureColumn items={withCopy(SHARING_FEATURES_LEFT)} />
          <ShowcasePhone
            photoAlt={k("sharing_phone_alt")}
            eventTitle={k("sharing_phone_event")}
            uploadLabel={k("sharing_phone_upload")}
            countLabel={k("sharing_phone_count")}
          />
          <FeatureColumn items={withCopy(SHARING_FEATURES_RIGHT)} />
        </div>
      </div>
    </section>
  );
};
